const https = require("http");

const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const path = require("path");
const sharp = require("sharp");
const os = require("os");
const fs = require("fs-extra");
const gs = require("gs");

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));

const cacheMaxAge = 5 * 60 * 60; // 5 hrs

async function verifyToken(req, res, next) {
  try {
    const token = (req.get("Authorization") || "").replace("Bearer ", "");
    await admin.auth().verifyIdToken(token);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

app.get("/editionData", verifyToken, async (request, response) => {
  try {
    const year = request.query.year;
    const bucket = admin.storage().bucket();
    const pdfs = await bucket.getFiles({
      prefix: `pdf/${year}`,
    });
    const showListing = (
      await admin.firestore().collection("settings").get()
    ).docs[0].get("showListing");

    const pdfUrls = pdfs[0].map((file) => {
      const isListing =
        file.metadata.metadata.listinglop.toLowerCase() === "true";

      const edition = file.name.replace(".pdf", "").split("-")[1];
      return {
        listinglop: isListing,
        url: getDownloadURL(file.name, file.bucket.name),
        year: year,
        edition: edition,
      };
    });

    const returnObject = {
      year,
      pdfs: pdfUrls
        .filter((data) => (data.listinglop && showListing) || !data.listinglop)
        .reverse(),
    };
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

    http.get(downloadURL, (res) => res.pipe(responsePipe));
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

    await bucket
      .file(filePath)
      .download({ destination: tempFilePath, validation: false });
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
