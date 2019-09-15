import React, { useState, useEffect } from "react";

import { Spinner } from "react-bootstrap";

import ImageRow from "./ImageRow.js";

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
      let items = list.prefixes;
      for (let i = 0; i < items.length; i++) {
        let imgRefs = await items[i].list();
        let imgRefsItems = imgRefs.items;
        let object = {};
        let urls = [];
        for (let j = 0; j < imgRefsItems.length; j++) {
          let res = await imgRefsItems[j].getDownloadURL();
          urls.push(res);
        }
        object["year"] = items[i].name;
        object["urls"] = urls;
        loadImg.push(object);
        console.log(loadImg);
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

  return loading ? <Spinner animation="grow" /> : imgRows;
}

export default Home;
