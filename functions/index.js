const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const Fuse = require("fuse.js");
const functions = require("firebase-functions");
const algoliasearch = require("algoliasearch");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors());

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex("articles");

exports.addToIndex = functions.firestore
  .document("customers/{customerId}")

  .onCreate(snapshot => {
    const data = snapshot.data();
    const objectID = snapshot.id;

    return index.addObject({ ...data, objectID });
  });

exports.updateIndex = functions.firestore
  .document("customers/{customerId}")

  .onUpdate(change => {
    const newData = change.after.data();
    const objectID = change.after.id;
    return index.saveObject({ ...newData, objectID });
  });

exports.deleteFromIndex = functions.firestore
  .document("customers/{customerId}")

  .onDelete(snapshot => index.deleteObject(snapshot.id));

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

exports.sendCollectionToAlgolia = functions.https.onRequest(
  async (req, res) => {
    // This array will contain all records to be indexed in Algolia.
    // A record does not need to necessarily contain all properties of the Firestore document,
    // only the relevant ones.
    const algoliaRecords = [];

    // Retrieve all documents from the COLLECTION collection.
    const querySnapshot = await db.collection("articles").get();

    querySnapshot.docs.forEach(doc => {
      const document = doc.data();
      // Essentially, you want your records to contain any information that facilitates search,
      // display, filtering, or relevance. Otherwise, you can leave it out.
      const record = {
        objectID: document.id,
        title: document.title,
        author: document.author,
        layout: document.layout,
        edition: document.edition,
        tags: document.tags,
        type: document.type,
        content: document.content
      };

      algoliaRecords.push(record);
    });

    // After all records are created, we save them to
    index.saveObjects(algoliaRecords, (_error, content) => {
      res.status(200).send("articles was indexed to Algolia successfully.");
    });
  }
);

exports.search = functions.https.onRequest((request, response) =>
  app(request, response)
);
