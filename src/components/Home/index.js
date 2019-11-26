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

  function setRowMinHeight(year) {
    year = parseInt(year);
    if (year > 2014) {
      return "510px";
    } else if (year === 2014) {
      return "545px";
    } else if (year > 2010) {
      return "584px";
    } else {
      return "583px";
    }
  }

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
                height={setRowMinHeight(year.name)}
                offset={100}
                once
                placeholder={
                  <Loading
                    styles={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: setRowMinHeight(year.name),
                      marginBottom: "15px"
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
