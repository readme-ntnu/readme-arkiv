import React, { useState, useEffect } from "react";

import ImageRow from "./ImageRow/";
import "./Home.css";
import Loading from "../Loading";
import { withFirebase } from "../Firebase";

function Home({ firebase }) {
  const [data, setData] = useState([]);

  const [downloading, setDownloading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let isSubscribed = true;
      setDownloading(true);
      let storage = firebase.storage;
      let storageRef = storage.ref("images");
      let list = await storageRef.listAll();
      let items = list.prefixes.reverse();
      const arrayOfPromises = items.map(item => fetchDataForYear(item, storage))
      let responses = await Promise.all(arrayOfPromises);
      // eslint-disable-next-line no-unused-vars
      const loadImg = [...responses]
      if (isSubscribed) {
        setData(loadImg);
        setDownloading(false);
      }
      return () => (isSubscribed = false);
    }
    fetchData();
  }, [firebase.storage]);

  let imgRows = data.map(URLsrow => {
    return <ImageRow info={URLsrow} key={URLsrow.year} />;
  });

  if (downloading) {
    return <Loading />;
  } else {
    return <div className="row-container">{imgRows}</div>;
  }
}
async function fetchDataForYear(yearPrefix, storage) {
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
  let urls = await Promise.all(imgRefsItems.map(ref => ref.getDownloadURL()))
  return urls;
}

async function fetchPDFsForAYear(yearPrefix, storage) {
  let year = yearPrefix.name;
  let PDFRefs = await storage.ref("pdf/" + year).list();
  let PDFRefsItems = PDFRefs.items.reverse();
  const pdfUrls = await Promise.all(PDFRefsItems.map(ref => ref.getDownloadURL()))
  return pdfUrls;
}

export default withFirebase(Home);
