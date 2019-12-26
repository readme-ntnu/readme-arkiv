import React, { useState, useEffect } from "react";

import ImageRow, { setRowMinHeight } from "./ImageRow/";
import "./Home.css";
import Loading from "../Loading";
import LazyLoad from "react-lazyload";
import { withFirebase } from "../Firebase";

function Home({ firebase }) {
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
        {data.map(year => {
          return (
            <div key={year} className="row-wrapper">
              <h2 className="year">{year.name}</h2>
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
