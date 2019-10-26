import React, { useState, useEffect } from "react";

import ImageRow from "./ImageRow/";
import "./Home.css";
import Loading from "../Loading";
import { withFirebase } from "../Firebase";

function Home(props) {
  const [data, setData] = useState([]);

  const [downloading, setDownloading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    async function fetchData() {
      setDownloading(true);
      var loadImg = [];
      let storage = props.firebase.storage;
      let storageRef = storage.ref("images");
      let list = await storageRef.listAll();
      let arrayOfPromises = [];
      let items = list.prefixes.reverse();
      for (let i = 0; i < items.length; i++) {
        arrayOfPromises.push(fetchDataForYear(items[i], storage));
      }
      let responses = await Promise.all(arrayOfPromises);
      // eslint-disable-next-line no-unused-vars
      for (const yearObj of responses) {
        loadImg.push(yearObj);
      }
      if (isSubscribed) {
        setData(loadImg);
        setDownloading(false);
      }
      return () => (isSubscribed = false);
    }
    fetchData();
  }, [props.firebase.storage]);

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
  let urls = [];
  for (let j = 0; j < imgRefsItems.length; j++) {
    let res = await imgRefsItems[j].getDownloadURL();
    urls.push(res);
  }
  return urls;
}

async function fetchPDFsForAYear(yearPrefix, storage) {
  let year = yearPrefix.name;
  let PDFrefs = await storage.ref("pdf/" + year).list();
  let PDFrefsItems = PDFrefs.items.reverse();
  let pdfUrls = [];
  for (let i = 0; i < PDFrefsItems.length; i++) {
    let url = await PDFrefsItems[i].getDownloadURL();
    pdfUrls.push(url);
  }
  return pdfUrls;
}

export default withFirebase(Home);
