import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyCLhIKGOYZilQuXirB_W-1UmKNfQygETqw",
  authDomain: "readme-arkiv.firebaseapp.com",
  databaseURL: "https://readme-arkiv.firebaseio.com",
  projectId: "readme-arkiv",
  storageBucket: "readme-arkiv.appspot.com",
  messagingSenderId: "884912593534",
  appId: "1:884912593534:web:994587a01eb1bd1d85d62f",
};

class Firebase {
  constructor() {
    this.app = firebase.initializeApp(config);

    this.auth = firebase.auth();

    this.storage = firebase.storage();

    this.db = firebase.firestore();
    // eslint-disable-next-line no-restricted-globals
    if (location.hostname === "localhost") {
      this.storage.useEmulator("localhost", 9199);
      this.auth.useEmulator("http://localhost:9099");
      this.db.useEmulator("localhost", 8080);
    }
  }

  // *** Auth API ***

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doSignOut = () => this.auth.signOut();

  // *** Articles API ***
  article = (id) => this.db.collection("articles").doc(`${id}`);

  articles = () => this.db.collection("articles");

  addArticle = (article, callback = undefined, errorCallback = undefined) =>
    this.addArticleToDB(article, callback, errorCallback);

  updateArticle = (article, callback = undefined, errorCallback = undefined) =>
    this.updateArticleInDB(article, callback, errorCallback);

  // *** Editions API ***
  editions = (year) => this.fetchEditionDataForYear(year);

  editionListData = (year) => this.fetchEditionListDataForYear(year);

  editionYearPrefixes = () => this.fetchYearPrefixes();

  uploadEdition = (
    editionFile,
    listinglop,
    callback = undefined,
    errorCallback = undefined,
    updateProgessCallback = undefined
  ) =>
    this.doEditionUpload(
      editionFile,
      listinglop,
      callback,
      errorCallback,
      updateProgessCallback
    );

  // *** Settings API ***
  getSettings = () => this.fetchSettings();

  setShowListing = (value) => this.setShowListingSetting(value);

  // *** Helper functions ***
  fetchYearPrefixes = async () => {
    const list = await this.storage.ref("images").listAll();
    return list.prefixes.reverse();
  };

  fetchEditionDataForYear = async (yearPrefix) => {
    const host =
      process.env.NODE_ENV === "production"
        ? "https://us-central1-readme-arkiv.cloudfunctions.net/api/editionData"
        : "http://localhost:5001/readme-arkiv/us-central1/api/editionData";
    const res = await fetch(
      `${host}?year=${encodeURIComponent(yearPrefix.name)}`,
      {
        headers: {
          Authorization: `Bearer ${await this.auth.currentUser.getIdToken()}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const result = await res.json();
    return result;
  };

  fetchEditionListDataForYear = async (yearPrefix) => {
    let imgRefs = (await yearPrefix.list()).items;
    let year = yearPrefix.name;
    let PDFRefs = (await this.storage.ref("pdf/" + year).list()).items;
    const yearObject = imgRefs.map((imgRef, index) => {
      return {
        edition: `${year}-0${index + 1}`,
        imgRef,
        pdfRef: PDFRefs[index],
      };
    });
    return yearObject;
  };

  doEditionUpload = async (
    editionFile,
    listinglop,
    callback,
    errorCallback,
    updateProgessCallback
  ) => {
    const self = this;
    const year = editionFile.name.split("-")[0];
    const path = `pdf/${year}/${editionFile.name}`;
    const metadata = {
      contentType: "application/pdf",
      customMetadata: {
        listinglop: String(listinglop),
      },
    };
    const editionPDFRef = this.storage.ref(path);
    const uploadTask = editionPDFRef.put(editionFile, metadata);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function (snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (
          updateProgessCallback &&
          typeof updateProgessCallback === "function"
        ) {
          updateProgessCallback(progress);
        }
      },
      function (error) {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            throw Error("Error, not authorized for file upload");

          case "storage/unknown":
            throw Error("Unkown error, file upload failed.");
          default:
        }
        if (errorCallback && typeof errorCallback === "function") {
          errorCallback();
        }
      },
      function () {
        // Upload completed successfully, now we can get the download URL
        const downloadURL = self.getPDFDownloadURL(year, editionFile.name);
        console.log("File available at", downloadURL);
        const editionName = editionFile.name.replace(".pdf", "");
        self.updateArticlePDFURL(editionName, downloadURL);

        if (callback && typeof callback === "function") {
          callback();
        }
      }
    );
  };

  updateArticlePDFURL = async (editionName, newURL) => {
    const articles = await this.db
      .collection("articles")
      .where("edition", "==", editionName)
      .get();
    if (articles && !articles.empty) {
      articles.forEach(async (docSnap) => {
        await docSnap.ref.update({
          url: `${newURL}#page=${this.getPageNumber(docSnap.data())}`,
        });
      });
    }
  };

  addArticleToDB = async (article, callback, errorCallback) => {
    try {
      const url = this.getArticlePDFURL(article);
      article.url = url;
      await this.db.collection("articles").add(article);
      console.log("Article added to DB");
      if (callback && typeof callback === "function") {
        callback();
      }
    } catch (error) {
      console.error(
        "Something when wrong during edition upload, failed with error: ",
        error
      );
      if (errorCallback && typeof errorCallback === "function") {
        errorCallback();
      }
    }
  };

  updateArticleInDB = async (article, callback, errorCallback) => {
    try {
      const url = this.getArticlePDFURL(article);
      article.url = url;
      const articleRef = this.article(article._id);
      await articleRef.update(article);
      console.log("Article added to DB");
      if (callback && typeof callback === "function") {
        callback();
      }
    } catch (error) {
      console.error(
        "Something when wrong during edition upload, failed with error: ",
        error
      );
      if (errorCallback && typeof errorCallback === "function") {
        errorCallback();
      }
    }
  };

  getArticlePDFURL = (article) => {
    const year = article.edition.split("-")[0];
    let pdfURL = this.getPDFDownloadURL(year, article.edition);
    if (article.pages) {
      pdfURL = `${pdfURL}#page=${this.getPageNumber(article)}`;
    }
    return pdfURL;
  };

  getPageNumber = (article) => {
    const [editionYear, editionNumber] = article.edition.split("-");
    if (
      editionYear > 2013 ||
      (parseInt(editionYear) === 2013 && parseInt(editionNumber) === 6)
    ) {
      return Math.floor(article.pages[0] / 2) + 1;
    } else {
      return article.pages[0];
    }
  };

  getPDFDownloadURL = (year, name) => {
    const root =
      process.env.NODE_ENV === "development"
        ? "localhost:9199"
        : "https://storage.googleapis.com";
    return `${root}/${process.env.REACT_APP_STORAGE_BUCKET}/pdf/${year}/${name}`;
  };

  fetchSettings = async () => {
    const settings = await this.db.collection("settings").get();
    return settings.docs[0].data();
  };

  setShowListingSetting = async (value) => {
    const settings = await this.db.collection("settings").get();
    await settings.docs[0].ref.update({
      showListing: value,
    });
  };
}

export default Firebase;
