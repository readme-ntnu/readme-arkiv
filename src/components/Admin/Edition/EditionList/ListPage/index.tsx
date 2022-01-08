import { StorageReference } from "firebase/storage";
import React, { useState, useEffect, useCallback, FC } from "react";
import { Fade } from "react-bootstrap";
import { withFirebase } from "../../../../Firebase";
import { WithFirebaseProps } from "../../../../Firebase/context";
import { IEditionListData } from "../../../../Firebase/firebase";
import { Loading } from "../../../../Loading";
import { ListElement } from "../ListElement";

import styles from "./ListPage.module.css";

const PlainListPage: FC<WithFirebaseProps & { year: StorageReference }> = ({
  firebase,
  year,
}) => {
  const [downloading, setDownloading] = useState(true);
  const [info, setInfo] = useState<IEditionListData[]>([]);

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
    <div className={styles.list}>
      <Fade appear in>
        <h3 className="year">{year.name}</h3>
      </Fade>
      {downloading ? <Loading /> : null}
      {!downloading && listElements ? listElements : null}
    </div>
  );
};

export const ListPage = withFirebase(PlainListPage);
