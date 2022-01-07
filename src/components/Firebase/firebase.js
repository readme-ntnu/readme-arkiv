import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  query,
  addDoc,
  getDocs,
  updateDoc,
  connectFirestoreEmulator,
  where,
} from "firebase/firestore";
import {
  getStorage,
  connectStorageEmulator,
  ref,
  uploadBytesResumable,
  listAll,
} from "firebase/storage";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  connectAuthEmulator,
} from "firebase/auth";

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
    this.app = initializeApp(config);

    this.auth = getAuth(this.app);

    this.storage = getStorage(this.app);

    this.db = getFirestore(this.app);

    if (process.env.NODE_ENV === "development") {
      connectStorageEmulator(this.storage, "localhost", 9199);
      connectAuthEmulator(this.auth, "http://localhost:9099");
      connectFirestoreEmulator(this.db, "localhost", 8080);
    }
  }

  // *** Auth API ***

  doSignInWithEmailAndPassword = (email, password) =>
    signInWithEmailAndPassword(this.auth, email, password);

  doPasswordReset = (email) => sendPasswordResetEmail(this.auth, email);

  doSignOut = () => signOut(this.auth);

  // *** Articles API ***
  article = (id) => doc(this.db, `articles/${id}`);

  articles = () => collection(this.db, "articles");

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
    const list = await listAll(ref(this.storage, "images"));
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
    let imgRefs = (await listAll(yearPrefix)).items;
    let year = yearPrefix.name;
    let PDFRefs = (await listAll(ref(this.storage, "pdf/" + year))).items;
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
    const editionPDFRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(
      editionPDFRef,
      editionFile,
      metadata
    );
    uploadTask.on(
      "state_changed",
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
    const articles = await getDocs(
      query(
        collection(this.db, "articles"),
        where("edition", "==", editionName)
      )
    );
    if (articles && !articles.empty) {
      articles.forEach(async (docSnap) => {
        await updateDoc(docSnap.ref, {
          url: `${newURL}#page=${this.getPageNumber(docSnap.data())}`,
        });
      });
    }
  };

  addArticleToDB = async (article, callback, errorCallback) => {
    try {
      const url = this.getArticlePDFURL(article);
      article.url = url;
      await addDoc(collection(this.db, "articles"), article);
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
    const settings = await getDocs(query(collection(this.db, "settings")));
    return settings.docs[0].data();
  };

  setShowListingSetting = async (value) => {
    const settings = await getDocs(query(collection(this.db, "settings")));
    await updateDoc(settings.docs[0].ref, {
      showListing: value,
    });
  };
}

export default Firebase;
