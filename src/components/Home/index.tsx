import React, { useState, useEffect } from "react";
import { Fade } from "react-bootstrap";
import LazyLoad from "react-lazyload";

import "./Home.css";
import { withFirebase, useAnonymousLogin } from "../Firebase";
import ImageRow, { setRowMinHeight } from "./ImageRow";
import Loading from "../Loading";

function Home({ firebase }) {
  const { user } = useAnonymousLogin();
  const [data, setData] = useState([]);
  const [downloading, setDownloading] = useState<boolean>(true);

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
    if (user != null) {
      fetchData();
    }
  }, [firebase, user]);

  if (downloading) {
    return <Loading />;
  } else {
    return (
      <div className="row-container">
        {data.map((year) => {
          return (
            <div key={year} className="row-wrapper">
              <Fade appear in>
                <h2 className="year">{year.name}</h2>
              </Fade>
              <LazyLoad height={setRowMinHeight(year.name)} offset={100} once>
                <ImageRow year={year} key={year} />
              </LazyLoad>
            </div>
          );
        })}
      </div>
    );
  }
}

export default withFirebase(Home);