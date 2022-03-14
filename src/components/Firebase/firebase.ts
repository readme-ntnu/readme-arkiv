import { FirebaseApp, initializeApp } from "firebase/app";
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
  Firestore,
  DocumentData,
} from "firebase/firestore";
import {
  getStorage,
  connectStorageEmulator,
  ref,
  uploadBytesResumable,
  listAll,
  FirebaseStorage,
  StorageReference,
} from "firebase/storage";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  connectAuthEmulator,
  Auth,
} from "firebase/auth";
import {
  getFunctions,
  httpsCallable,
  Functions,
  connectFunctionsEmulator,
} from "firebase/functions";
import { IArticle } from "../Admin/Article/types";

const config = {
  apiKey: "AIzaSyCLhIKGOYZilQuXirB_W-1UmKNfQygETqw",
  authDomain: "readme-arkiv.firebaseapp.com",
  databaseURL: "https://readme-arkiv.firebaseio.com",
  projectId: "readme-arkiv",
  storageBucket: "readme-arkiv.appspot.com",
  messagingSenderId: "884912593534",
  appId: "1:884912593534:web:994587a01eb1bd1d85d62f",
};
export interface IEditionData {
  listinglop: boolean;
  url: string;
  year: string;
  edition: string;
}

export interface IEditionListData {
  edition: string;
  imgRef: StorageReference;
  pdfRef: StorageReference;
}

export interface IEditionDataForYear {
  year: string;
  pdfs: IEditionData[];
}

export class Firebase {
  app: FirebaseApp;
  auth: Auth;
  storage: FirebaseStorage;
  db: Firestore;
  functions: Functions;

  constructor() {
    this.app = initializeApp(config);

    this.auth = getAuth(this.app);

    this.storage = getStorage(this.app);

    this.db = getFirestore(this.app);

    this.functions = getFunctions(this.app, "europe-west1");

    if (process.env.NODE_ENV === "development") {
      connectStorageEmulator(this.storage, "localhost", 9199);
      connectAuthEmulator(this.auth, "http://localhost:9099");
      connectFirestoreEmulator(this.db, "localhost", 8080);
      connectFunctionsEmulator(this.functions, "localhost", 5001);
    }
  }

  // *** Auth API ***

  doSignInWithEmailAndPassword = (email: string, password: string) =>
    signInWithEmailAndPassword(this.auth, email, password);

  doPasswordReset = (email: string) => sendPasswordResetEmail(this.auth, email);

  doSignOut = () => signOut(this.auth);

  // *** Articles API ***
  article = (id: string) => doc(this.db, `articles/${id}`);

  articles = () => collection(this.db, "articles");

  addArticle = (
    article: IArticle,
    callback?: () => void,
    errorCallback?: () => void
  ) => this.addArticleToDB(article, callback, errorCallback);

  updateArticle = (
    article: IArticle,
    callback?: () => void,
    errorCallback?: () => void
  ) => this.updateArticleInDB(article, callback, errorCallback);

  // *** Editions API ***
  editions = (year: StorageReference) => this.fetchEditionDataForYear(year);

  editionListData = (year: StorageReference) =>
    this.fetchEditionListDataForYear(year);

  editionYearPrefixes = () => this.fetchYearPrefixes();

  uploadEdition = (
    editionFile: File,
    listinglop: boolean,
    callback?: () => void,
    errorCallback?: () => void,
    updateProgessCallback?: (progress: number) => void
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

  setShowListing = (value: boolean) => this.setShowListingSetting(value);

  // *** Helper functions ***
  fetchYearPrefixes = async () => {
    const list = await listAll(ref(this.storage, "images"));
    return list.prefixes.reverse();
  };

  fetchEditionDataForYear = async (yearPrefix: StorageReference) => {
    const editionData = httpsCallable<{ year: string }, IEditionDataForYear>(
      this.functions,
      "editionData"
    );
    try {
      const result = await editionData({ year: yearPrefix.name });
      return result.data;
    } catch (err) {
      console.log(err);
    }
  };

  fetchEditionListDataForYear = async (
    yearPrefix: StorageReference
  ): Promise<IEditionListData[]> => {
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
    editionFile: File,
    listinglop: boolean,
    callback?: () => void,
    errorCallback?: () => void,
    updateProgessCallback?: (progress: number) => void
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

  updateArticlePDFURL = async (editionName: unknown, newURL: string) => {
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

  addArticleToDB = async (
    article: IArticle,
    callback?: () => void,
    errorCallback?: () => void
  ) => {
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

  updateArticleInDB = async (
    article: IArticle,
    callback?: () => void,
    errorCallback?: () => void
  ) => {
    try {
      const url = this.getArticlePDFURL(article);
      article.url = url;
      const articleRef = this.article(article._id as string);
      await updateDoc(articleRef, article as { [x: string]: any });
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

  getArticlePDFURL = (article: { edition: string; pages: any }) => {
    const year = article.edition.split("-")[0];
    let pdfURL = this.getPDFDownloadURL(year, article.edition);
    if (article.pages) {
      pdfURL = `${pdfURL}#page=${this.getPageNumber(article)}`;
    }
    return pdfURL;
  };

  getPageNumber = (article: DocumentData) => {
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

  getPDFDownloadURL = (year: string, name: string) => {
    const root =
      process.env.NODE_ENV === "development"
        ? "localhost:9199"
        : "https://storage.googleapis.com";
    let url = `${root}/${process.env.REACT_APP_STORAGE_BUCKET}/pdf/${year}/${name}`;
    if (!url.endsWith(".pdf")) {
      url += ".pdf";
    }
    return url;
  };

  fetchSettings = async () => {
    const settings = await getDocs(query(collection(this.db, "settings")));
    return settings.docs[0].data();
  };

  setShowListingSetting = async (value: boolean) => {
    const settings = await getDocs(query(collection(this.db, "settings")));
    await updateDoc(settings.docs[0].ref, {
      showListing: value,
    });
  };
}
