import React, { useState, useEffect, useCallback } from "react";
import { Fade } from "react-bootstrap";
import { withFirebase } from "../../../../Firebase";

import ListElement from "../ListElement";
import Loading from "../../../../Loading";

import { list } from "./ListPage.module.css";

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
      <Fade appear in>
        <h3 className="year">{year.name}</h3>
      </Fade>
      {downloading ? <Loading /> : null}
      {!downloading && listElements ? listElements : null}
    </div>
  );
}

export default withFirebase(ListPage);
