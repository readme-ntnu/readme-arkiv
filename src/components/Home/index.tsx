import { useState, useEffect, FC } from "react";
import { Fade } from "react-bootstrap";
import LazyLoad from "react-lazyload";

import "./Home.css";
import { withFirebase, useAnonymousLogin } from "../Firebase";
import { ImageRow, setRowMinHeight } from "./ImageRow";
import { WithFirebaseProps } from "../Firebase/context";
import { StorageReference } from "firebase/storage";
import { Loading } from "../Loading";

const PlainHome: FC<WithFirebaseProps> = ({ firebase }) => {
  const { user } = useAnonymousLogin();
  const [data, setData] = useState<StorageReference[]>([]);
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
            <div key={year.name} className="row-wrapper">
              <Fade appear in>
                <h2 className="year">{year.name}</h2>
              </Fade>
              <LazyLoad height={setRowMinHeight(year.name)} offset={100} once>
                <ImageRow year={year} key={year.name} />
              </LazyLoad>
            </div>
          );
        })}
      </div>
    );
  }
};

export const Home = withFirebase(PlainHome);
