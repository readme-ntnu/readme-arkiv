import React, { useState, useEffect } from "react";

import { Spinner } from "react-bootstrap";

import ImageRow from "./ImageRow.js";
import "./Home.css";

import * as firebase from "firebase";

function Home() {
  const [images, setImages] = useState([]);

  const [downloading, setDownloading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setDownloading(true);
      var loadImg = [];
      let storage = firebase.storage();
      let storageRef = storage.ref("images");
      let list = await storageRef.listAll();
      let arrayOfPromises = [];
      let items = list.prefixes.reverse();
      for (let i = 0; i < items.length; i++) {
        arrayOfPromises.push(fetchDataForYear(items[i]));
      }
      let responses = await Promise.all(arrayOfPromises);
      for (var yearObj of responses) {
        loadImg.push(yearObj);
      }
      setImages(loadImg);
      setDownloading(false);
    }
    fetchData();
  }, []);

  let imgRows = images.map(URLsrow => {
    return <ImageRow info={URLsrow} key={URLsrow.year} />;
  });

  if (downloading) {
    return <Spinner animation="grow" />;
  } else {
    return <div className="row-container">{imgRows}</div>;
  }
}
async function fetchDataForYear(yearPrefix) {
  let object = {};
  let response = await Promise.all([
    fetchImagesForAYear(yearPrefix),
    fetchPDFsForAYear(yearPrefix)
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

async function fetchPDFsForAYear(yearPrefix) {
  let storage = firebase.storage();
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

export default Home;
