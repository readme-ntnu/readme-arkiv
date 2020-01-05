import React, { useState, useEffect } from "react";
import { withFirebase } from "../../../Firebase";

import ListElement from "../ListElement";
import Loading from "../../../Loading";

import { list } from "./ListPage.module.css";
import { useCallback } from "react";

function ListPage({ firebase, year }) {
  const [downloading, setDownloading] = useState(true);
  const [info, setInfo] = useState([]);

  const fetchData = useCallback(async () => {
    let isSubscribed = true;
    setDownloading(true);
    const info = await firebase.editionListData(year);
    if (isSubscribed) {
      setInfo(info);
      setDownloading(false);
    }
    return () => (isSubscribed = false);
  }, [firebase, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  let listElements;

  if (info && info.length) {
    listElements = info.map((obj, index) => (
      <ListElement obj={obj} key={index} removeSelf={() => fetchData()} />
    ));
  }

  return (
    <div className={list}>
      {listElements || downloading ? (
        <h2 className="year">{year.name}</h2>
      ) : null}
      {downloading ? <Loading /> : null}
      {!downloading && listElements ? listElements : null}
    </div>
  );
}

export default withFirebase(ListPage);
