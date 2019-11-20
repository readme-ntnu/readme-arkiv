import React, { useState, useEffect } from "react";

import ImageRow from "./ImageRow/";
import "./Home.css";
import Loading from "../Loading";
import LazyLoad from "react-lazyload";
import { withFirebase } from "../Firebase";

function Home({ firebase }) {
  const [data, setData] = useState([]);
  const [downloading, setDownloading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let isSubscribed = true;
      setDownloading(true);
      let list = await firebase.storage.ref("images").listAll();
      let items = list.prefixes.reverse();
      if (isSubscribed) {
        setData(items);
        setDownloading(false);
      }
      return () => (isSubscribed = false);
    }
    fetchData();
  }, [firebase.storage]);

  if (downloading) {
    return <Loading />;
  } else {
    return (
      <div className="row-container">
        {data.map(year => {
          return (
            <div className="row-wrapper">
              <h2 className="year">{year.name}</h2>
              <LazyLoad
                height={490}
                offset={100}
                once
                placeholder={
                  <Loading
                    styles={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "500px"
                    }}
                  />
                }
              >
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
