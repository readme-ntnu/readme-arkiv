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
const storage = admin.storage();

const app = express();
app.use(cors());

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
    { name: "type", weight: 0.1 }
  ]
};

let articles;

app.get("/", async (request, response) => {
  try {
    const searchString = request.query.searchString;
    if (!articles) {
      // If local in-memory cache is empty, we need to query the Firestore database
      articles = [];
      const articlesRef = db.collection("articles");

      const query = await articlesRef.get();
      query.docs.forEach(doc => articles.push(doc.data()));
    }

    const fuse = new Fuse(articles, fuzzySearchOptions);
    const result = fuse.search(searchString);

    response.json({ articles: result });
  } catch (error) {
    response.status(500).json({ message: error.toString() });
  }
});

app.get("/update", async (request, response) => {
  try {
    const articlesRef = await db.collection("articles").listDocuments();
    articlesRef.forEach(async doc => {
      const data = await doc.get();
      doc.update({
        url: getURL(data)
      });
    });

    response.status(200).json({ message: "Success!" });
  } catch (error) {
    response.status(500).json({ message: error.toString() });
  }
});

async function getURL(docData) {
  const editionYear = docData.edition.split("-")[0];
  const PDFRef = await storage.ref(`pdf/${editionYear}/${docData.edition}.pdf`);
  const downloadURL = PDFRef.getDownloadURL();
  return `${downloadURL}#page=${docData.pages[0]}`;
}

exports.search = functions.https.onRequest((request, response) =>
  app(request, response)
);

const THUMB_MAX_WIDTH = 200;

exports.handlePDFUpload = functions.storage
  .object()
  .onFinalize(async object => {
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
        .executablePath("ghostscript/./gs-950-linux-x86_64")
        .batch()
        .nopause()
        .device("jpeg")
        .output(tempJPGFilePath)
        .input(tempFilePath)
        .exec(err => {
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
      contentType: "image/jpeg"
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
