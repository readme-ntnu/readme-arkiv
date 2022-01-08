import React, { useState, useEffect, FC } from "react";
import { withAuthorization } from "../../../Session";
import { Fade } from "react-bootstrap";

import { Loading } from "../../../Loading";
import { ListPage } from "./ListPage";
import { WithFirebaseProps } from "../../../Firebase/context";
import { StorageReference } from "firebase/storage";
import { User } from "firebase/auth";

const PlainEditionList: FC<WithFirebaseProps> = ({ firebase }) => {
  const [data, setData] = useState<StorageReference[]>([]);
  const [downloading, setDownloading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let isSubscribed = true;
      setDownloading(true);
      const items = await firebase.editionYearPrefixes();
      if (isSubscribed) {
        setData(items);
        setDownloading(false);
      }
      return () => (isSubscribed = false);
    }
    fetchData();
  }, [firebase]);

  return (
    <>
      <Fade appear in>
        <h1>Utgaver</h1>
      </Fade>
      {downloading ? (
        <Loading />
      ) : (
        <div className="row-container">
          {data.map((year) => {
            return (
              <div key={year.name} className="row-wrapper">
                <ListPage year={year} key={year.name} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const condition = (authUser: User) => !!authUser && !authUser.isAnonymous;

export const EditionList = withAuthorization(condition)(PlainEditionList);
