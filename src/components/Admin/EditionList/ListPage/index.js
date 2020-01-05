import React, { useState, useEffect } from "react";
import { withFirebase } from "../../../Firebase";

import ListElement from "../ListElement";
import Loading from "../../../Loading";

import { list } from "./ListPage.module.css";

function ListPage({ firebase, year }) {
  const [downloading, setDownloading] = useState(true);
  const [info, setInfo] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let isSubscribed = true;
      setDownloading(true);
      const info = await firebase.editionListData(year);
      if (isSubscribed) {
        setInfo(info);
        setDownloading(false);
      }
      return () => (isSubscribed = false);
    }
    fetchData();
  }, [firebase, year]);

  let listElements;

  if (info && info.length) {
    listElements = info.map((obj, index) => (
      <ListElement obj={obj} key={index} />
    ));
  }

  return <div className={list}>{downloading ? <Loading /> : listElements}</div>;
}

export default withFirebase(ListPage);
