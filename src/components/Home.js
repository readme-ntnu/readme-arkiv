import React, { useState, useEffect } from "react";

import { Spinner } from "react-bootstrap";

import ImageRow from "./ImageRow.js";
import "./Home.css";

import * as firebase from "firebase";

function Home() {
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      var loadImg = [];
      let storage = firebase.storage();
      let storageRef = storage.ref("images");
      let list = await storageRef.listAll();
      let arrayOfPromises = [];
      let items = list.prefixes;
      for (let i = 0; i < items.length; i++) {
        arrayOfPromises.push(fetchImagesForYear(items[i]));
      }
      let responses = await Promise.all(arrayOfPromises);
      for (var yearObj of responses) {
        loadImg.push(yearObj);
      }
      setImages(loadImg);
    }
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  let imgRows = images.map(URLsrow => {
    return <ImageRow info={URLsrow} key={URLsrow.year} />;
  });

  imgRows.reverse();

  return loading ? (
    <Spinner animation="grow" />
  ) : (
    <div className="row-container">{imgRows}</div>
  );
}

async function fetchImagesForYear(yearPrefix) {
  let imgRefs = await yearPrefix.list();
  let imgRefsItems = imgRefs.items;
  let object = {};
  let urls = [];
  for (let j = 0; j < imgRefsItems.length; j++) {
    let res = await imgRefsItems[j].getDownloadURL();
    urls.push(res);
  }
  object["year"] = yearPrefix.name;
  object["urls"] = urls;
  return object;
}

export default Home;
