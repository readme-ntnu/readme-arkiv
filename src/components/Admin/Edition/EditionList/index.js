import React, { useState, useEffect } from "react";
import { withAuthorization } from "../../../Session";
import { Fade } from "react-bootstrap";

import ListPage from "./ListPage";
import Loading from "../../../Loading";

function EditionList({ firebase }) {
  const [data, setData] = useState([]);
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
          {data.map(year => {
            return (
              <div key={year} className="row-wrapper">
                <ListPage year={year} key={year} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(EditionList);
