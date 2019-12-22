import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();

    this.storage = app.storage();

    this.db = app.firestore();
  }

  // *** Auth API ***

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doSignOut = () => this.auth.signOut();

  // *** Articles API ***
  article = id => this.db.collection("articles").doc(`${id}`);

  articles = () => this.db.collection("articles");

  addArticle = (article, callback = undefined) =>
    addArticleToDB(article, callback, this.db);

  // *** Editions API ***
  editions = year => fetchEditionDataForYear(year, this.storage);

  editionYearPrefixes = () => fetchYearPrefixes(this.storage);

  uploadEdition = (editionFile, callback = undefined) =>
    doEditionUpload(editionFile, callback, this.storage, this.db);
}

async function fetchYearPrefixes(storage) {
  const list = await storage.ref("images").listAll();
  return list.prefixes.reverse();
}

async function fetchEditionDataForYear(yearPrefix, storage) {
  let object = {};
  let response = await Promise.all([
    fetchImagesForAYear(yearPrefix),
    fetchPDFsForAYear(yearPrefix, storage)
  ]);
  object["year"] = yearPrefix.name;
  object["urls"] = response[0];
  object["pdfs"] = response[1];
  return object;
}

async function fetchImagesForAYear(yearPrefix) {
  let imgRefs = await yearPrefix.list();
  let imgRefsItems = imgRefs.items.reverse();
  let urls = await Promise.all(imgRefsItems.map(ref => ref.getDownloadURL()));
  return urls;
}

async function fetchPDFsForAYear(yearPrefix, storage) {
  let year = yearPrefix.name;
  let PDFRefs = await storage.ref("pdf/" + year).list();
  let PDFRefsItems = PDFRefs.items.reverse();
  const pdfUrls = await Promise.all(
    PDFRefsItems.map(ref => ref.getDownloadURL())
  );
  return pdfUrls;
}

async function doEditionUpload(editionFile, callback, storage, db) {
  const year = editionFile.name.split("-")[0];
  const path = `pdf/${year}/${editionFile.name}`;
  const metadata = {
    contentType: "application/pdf"
  };
  const editionPDFRef = storage.ref(path);
  const uploadTask = editionPDFRef.put(editionFile, metadata);
  uploadTask.on(
    app.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
    },
    function(error) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          throw Error("Error, not authorized for file upload");

        case "storage/unknown":
          throw Error("Unkown error, file upload failed.");
        default:
      }
    },
    function() {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log("File available at", downloadURL);
        const editionName = editionFile.name.replace(".pdf", "");
        updateArticlePDFURL(editionName, downloadURL, db);
      });
      if (callback && typeof callback === "function") {
        callback();
      }
    }
  );
}

async function updateArticlePDFURL(editionName, newURL, db) {
  const articles = db
    .collection("articles")
    .where("edition", "==", editionName)
    .get();
  if (!articles.empty) {
    articles.forEach(async docSnap => {
      await docSnap.ref.update({
        url: newURL
      });
    });
  }
}

function addArticleToDB(article, callback, db) {
  db.collection("articles")
    .add(article)
    .then(() => {
      console.log("Article added to DB");
      if (callback && typeof callback === "function") {
        callback();
      }
    })
    .catch(error => console.error("Error adding document: ", error));
}
export default Firebase;
