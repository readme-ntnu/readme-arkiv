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

  // *** Editions API ***
  editions = year => fetchEditionDataForYear(year, this.storage);

  editionYearPrefixes = () => fetchYearPrefixes(this.storage);
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
export default Firebase;
