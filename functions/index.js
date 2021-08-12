const https = require("http");

const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const Fuse = require("fuse.js");

const path = require("path");
const sharp = require("sharp");
const os = require("os");
const fs = require("fs-extra");
const gs = require("gs");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));

const cacheMaxAge = 5 * 60 * 60; // 5 hrs

const fuzzySearchOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    { name: "title", weight: 0.3 },
    { name: "author", weight: 0.2 },
    { name: "layout", weight: 0.2 },
    { name: "edition", weight: 0.1 },
    { name: "tags", weight: 0.1 },
    { name: "type", weight: 0.1 },
  ],
};

let articles;

async function verifyToken(req, res, next) {
  try {
    const token = (req.get("Authorization") || "").replace("Bearer ", "");
    await admin.auth().verifyIdToken(token);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

app.get("/search", verifyToken, async (request, response) => {
  try {
    const searchString = request.query.searchString;
    if (!articles) {
      // If local in-memory cache is empty, we need to query the Firestore database
      articles = [];
      const articlesRef = db.collection("articles");

      const query = await articlesRef.get();
      query.docs.forEach((doc) => articles.push(doc.data()));
    }

    const fuse = new Fuse(articles, fuzzySearchOptions);
    const result = fuse.search(searchString);

    response.json({ articles: result });
  } catch (error) {
    response.status(500).json({ message: error.toString() });
  }
});

app.get("/editionData", verifyToken, async (request, response) => {
  try {
    const year = request.query.year;
    const bucket = admin.storage().bucket();
    const pdfs = await bucket.getFiles({
      prefix: `pdf/${year}`,
    });

    const pdfUrls = await Promise.all(
      pdfs[0].map(async (file) => {
        const isListing = await file
          .getMetadata()
          .then((data) => Boolean(data[0].metadata.listinglop))
          .catch((error) => {
            console.warn("Fond no metadata with error: ", error);
            return false;
          });
        const edition = file.name.replace(".pdf", "").split("-")[1];
        return {
          listinglop: isListing,
          url: getDownloadURL(file.name, file.bucket.name),
          year: year,
          edition: edition,
        };
      })
    );

    const returnObject = {
      year,
      pdfs: pdfUrls.reverse(),
    };
    response.set("Cache-Control", "public, max-age=10800");
    response.json(returnObject);
  } catch (error) {
    response.status(500).json({ message: error.toString() });
  }
});

exports.api = functions.https.onRequest(app);

exports.editionImage = functions.https.onRequest((request, response) => {
  try {
    const { year, edition } = request.query;

    const downloadURL = getDownloadURL(
      `images/${year}/${year}-${edition}.jpg`,
      admin.storage().bucket().name
    );

    const responsePipe = response.set(
      "Cache-Control",
      `public, max-age=${cacheMaxAge}`
    );
    console.log(downloadURL);

    https.get(downloadURL, (res) => res.pipe(responsePipe));
  } catch (error) {
    response.status(500).json({ message: error.toString() });
  }
});

const runtimeOpts = {
  timeoutSeconds: 180,
  memory: "512MB",
};

const THUMB_MAX_WIDTH = 620;

exports.handlePDFUpload = functions
  .runWith(runtimeOpts)
  .storage.object()
  .onFinalize(async (object) => {
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    // Get the file name.
    const fileName = path.basename(filePath);
    // Exit if the image is already a thumbnail.
    if (filePath.startsWith("images")) {
      return console.log("Already a Thumbnail.");
    }

    const bucket = admin.storage().bucket(fileBucket);
    const workingDir = path.join(os.tmpdir(), "thumbs");
    const tempFilePath = path.join(workingDir, fileName);
    const tempJPGFilePath = path
      .join(workingDir, fileName)
      .replace(".pdf", ".jpg");

    await fs.ensureDir(workingDir);

    await bucket.file(filePath).download({ destination: tempFilePath });
    console.log("PDF downloaded locally to", tempFilePath);

    await fs.ensureFile(tempJPGFilePath);

    await new Promise((resolve, reject) => {
      gs()
        .executablePath("gs")
        .batch()
        .nopause()
        .device("jpeg")
        .output(tempJPGFilePath)
        .input(tempFilePath)
        .exec((err) => {
          if (err) {
            console.log("Error while running Ghostscript", err);
            reject(err);
          } else {
            console.log("PDF conversion to JPG completed successfully");
            resolve();
          }
        });
    });

    const metadata = {
      contentType: "image/jpeg",
    };
    const thumbFilePath = path
      .join(path.dirname(filePath), fileName)
      .replace(".pdf", ".jpg")
      .replace("pdf", "images");

    const thumbnailUploadStream = bucket
      .file(thumbFilePath)
      .createWriteStream({ metadata });

    // Create Sharp pipeline for resizing the image and use pipe to read from bucket read stream
    const pipeline = sharp();
    pipeline.resize(THUMB_MAX_WIDTH).pipe(thumbnailUploadStream);

    fs.createReadStream(tempJPGFilePath).pipe(pipeline);

    await new Promise((resolve, reject) =>
      thumbnailUploadStream.on("finish", resolve).on("error", reject)
    );

    return fs.remove(workingDir);
  });

getDownloadURL = (name, bucketName) => {
  return `${
    process.env.NODE_ENV === "production"
      ? "https://storage.googleapis.com"
      : "http://localhost:9199"
  }/${bucketName}/${name}`;
};
