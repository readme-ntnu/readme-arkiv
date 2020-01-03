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
    this.addArticleToDB(article, callback);

  // *** Editions API ***
  editions = year => this.fetchEditionDataForYear(year);

  editionYearPrefixes = () => this.fetchYearPrefixes();

  uploadEdition = (editionFile, listinglop, callback = undefined) =>
    this.doEditionUpload(editionFile, listinglop, callback);

  // *** Settings API ***
  getSettings = () => this.fetchSettings();

  setShowListing = value => this.setShowListingSetting(value);

  // *** Helper functions ***
  fetchYearPrefixes = async () => {
    const list = await this.storage.ref("images").listAll();
    return list.prefixes.reverse();
  };

  fetchEditionDataForYear = async yearPrefix => {
    let object = {};
    let response = await Promise.all([
      this.fetchImagesForAYear(yearPrefix),
      this.fetchPDFsForAYear(yearPrefix)
    ]);
    object.year = yearPrefix.name;
    object.urls = response[0];
    object.pdfs = response[1];
    return object;
  };

  fetchImagesForAYear = async yearPrefix => {
    let imgRefs = await yearPrefix.list();
    let imgRefsItems = imgRefs.items.reverse();
    let urls = await Promise.all(imgRefsItems.map(ref => ref.getDownloadURL()));
    return urls;
  };

  fetchPDFsForAYear = async yearPrefix => {
    let year = yearPrefix.name;
    let PDFRefs = await this.storage.ref("pdf/" + year).list();
    let PDFRefsItems = PDFRefs.items.reverse();
    const pdfUrls = Promise.all(
      PDFRefsItems.map(async ref => {
        const dataFromServer = await ref
          .getMetadata()
          .then(data => data.customMetadata.listinglop)
          .catch(error => {
            console.warn("Fond no metadata with error: ", error);
            return false;
          });
        return {
          listinglop: dataFromServer === "true",
          url: await ref.getDownloadURL()
        };
      })
    );
    return pdfUrls;
  };

  doEditionUpload = async (editionFile, listinglop, callback) => {
    const year = editionFile.name.split("-")[0];
    const path = `pdf/${year}/${editionFile.name}`;
    const metadata = {
      contentType: "application/pdf",
      customMetadata: {
        listinglop: String(listinglop)
      }
    };
    const editionPDFRef = this.storage.ref(path);
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
          this.updateArticlePDFURL(editionName, downloadURL);
        });
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
      articles.forEach(async docSnap => {
        await docSnap.ref.update({
          url: `${newURL}#page=${this.getPageNumber(docSnap.data())}`
        });
      });
    }
  };

  addArticleToDB = async (article, callback) => {
    try {
      const url = await this.getArticlePDFURL(article);
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
    }
  };

  getArticlePDFURL = async article => {
    const year = article.edition.split("-")[0];
    const fileName = `${article.edition}.pdf`;
    const path = `pdf/${year}/${fileName}`;
    try {
      let pdfURL = await this.storage.ref(path).getDownloadURL();
      if (article.pages) {
        pdfURL = `${pdfURL}#page=${this.getPageNumber(article)}`;
      }
      return pdfURL;
    } catch (error) {
      throw Error("Failed to get article PDF URL, with error: ", error);
    }
  };

  getPageNumber = article => {
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

  fetchSettings = async () => {
    const settings = await this.db.collection("settings").get();
    return settings.docs[0].data();
  };

  setShowListingSetting = async value => {
    const settings = await this.db.collection("settings").get();
    await settings.docs[0].ref.update({
      showListing: value
    });
  };
}

export default Firebase;
