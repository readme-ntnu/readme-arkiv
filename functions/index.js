const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const Fuse = require("fuse.js");

const mkdirp = require("mkdirp-promise");
const spawn = require("child-process-promise").spawn;
const path = require("path");
const os = require("os");
const fs = require("fs-extra");
//const gs = require("gs");

// File extension for the created JPEG files.

admin.initializeApp();
const db = admin.firestore();

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

exports.createThumbnailFromPDF = functions.storage
  .object()
  .onFinalize(async object => {
    const contentType = object.contentType;

    //Exit if the file uploaded is not a PDF
    if (!contentType.startsWith("application/pdf")) {
      return console.log("This is not a PDF");
    }

    const filePath = object.name;
    const baseFileName = path.basename(filePath, path.extname(filePath));
    const fileDir = path.dirname(filePath);
    const JPEGFilePath = path.normalize(
      path.format({ dir: fileDir, name: baseFileName, ext: ".jpg" })
    );
    const tempLocalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(tempLocalFile);
    const thumbFilePath = filePath;
    const tempLocalJPEGFile = path.join(os.tmpdir(), JPEGFilePath);

    const bucket = admin.storage().bucket(object.bucket);
    // Create the temp directory where the storage file will be downloaded.
    await mkdirp(tempLocalDir);
    // Download file from bucket.
    await bucket.file(filePath).download({ destination: tempLocalFile });
    console.log("The file has been downloaded to", tempLocalFile);
    await new Promise((resolve, reject) => {
      gs()
        .device("jpeg")
        .executablePath("lambda-ghostscript/bin/./gs")
        .option("dFirstPage=1")
        .option("dLastPage=1")
        .res(200)
        .output(tempLocalJPEGFile)
        .input(tempLocalFile)
        .exec(err => {
          if (err) {
            console.log("Error running Ghostscript", err);
            reject(err);
          } else {
            console.log("Ghostscript process completed successfully!");
            resolve();
          }
        });
    });

    await spawn("convert", [
      tempLocalJPEGFile,
      "resize",
      "200x200",
      tempLocalJPEGFile
    ]);
    thumbFilePath.replace(".pdf", ".png").replace("pdf", "images");

    await bucket.upload(tempLocalJPEGFile, { destination: thumbFilePath });
    console.log("JPEG image uploaded to Storage at", thumbFilePath);
    // Once the image has been converted delete the local files to free up disk space.
    fs.unlinkSync(tempLocalJPEGFile);
    fs.unlinkSync(tempLocalFile);
    return null;
  });

exports.search = functions.https.onRequest((request, response) =>
  app(request, response)
);
