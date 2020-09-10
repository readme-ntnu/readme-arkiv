import React, { useState, useEffect } from "react";
import { Fade } from "react-bootstrap";
import LazyLoad from "react-lazyload";

import "./Home.css";
import { withFirebase, useAnonymousLogin } from "../Firebase";
import ImageRow, { setRowMinHeight } from "./ImageRow/";
import Loading from "../Loading";

function Home({ firebase }) {
  useAnonymousLogin();
  const [data, setData] = useState([]);
  const [showListing, setShowListing] = useState(false);
  const [downloading, setDownloading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let isSubscribed = true;
      setDownloading(true);
      const items = await firebase.editionYearPrefixes();
      const settings = await firebase.getSettings();
      if (isSubscribed) {
        setData(items);
        setShowListing(settings.showListing);
        setDownloading(false);
      }
      return () => (isSubscribed = false);
    }
    fetchData();
  }, [firebase]);

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
                <ImageRow year={year} key={year} showListing={showListing} />
              </LazyLoad>
            </div>
          );
        })}
      </div>
    );
  }
}

export default withFirebase(Home);
