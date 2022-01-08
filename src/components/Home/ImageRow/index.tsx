import React, { useState, useEffect, FC } from "react";
import { withFirebase } from "../../Firebase";

import { Image } from "react-bootstrap";
import FadeIn from "react-lazyload-fadein";

import "./ImageRow.css";
import { WithFirebaseProps } from "../../Firebase/context";
import { StorageReference } from "firebase/storage";
import { IEditionDataForYear } from "../../Firebase/firebase";
import { RowLoader } from "./RowLoader";

interface ImageRowProps extends WithFirebaseProps {
  year: StorageReference;
}

const PlainImageRow: FC<ImageRowProps> = ({ year, firebase }) => {
  const [downloading, setDownloading] = useState(true);
  const [info, setInfo] = useState<IEditionDataForYear>();

  useEffect(() => {
    async function fetchData() {
      let isSubscribed = true;
      setDownloading(true);
      const info = await firebase.editions(year);
      if (isSubscribed) {
        setInfo(info);
        setDownloading(false);
      }
      return () => (isSubscribed = false);
    }
    fetchData();
  }, [firebase, year]);

  let imagesLen, images1, images2;

  if (info.pdfs) {
    const images = info.pdfs
      .map((pdf) => (
        <a
          className="RowImage"
          key={pdf.url}
          href={pdf.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={`https://${process.env.PUBLIC_URL}/editionImage?year=${pdf.year}&edition=${pdf.edition}`}
            fluid
          />
        </a>
      ))
      .filter((image) => image);

    imagesLen = images.length;
    images1 = images.slice(0, 3);
    images2 = images.slice(3, imagesLen);
  }

  return (
    <div className="ImageRow">
      {downloading ? (
        <RowLoader minHeight={setRowMinHeight(year.name)} />
      ) : (
        <FadeIn height={setRowMinHeight(year.name)}>
          {(onLoad) => (
            <>
              <div
                onLoad={onLoad}
                className="row"
                style={{ minHeight: setImageMinHeight(year.name) }}
              >
                {images1}
              </div>

              <div
                onLoad={onLoad}
                className="row"
                style={{
                  minHeight:
                    images2 && images2.length
                      ? setImageMinHeight(year.name)
                      : "0px",
                }}
              >
                {images2 && images2.length ? images2 : null}
              </div>
            </>
          )}
        </FadeIn>
      )}
    </div>
  );
};

function setRowMinHeight(year) {
  year = parseInt(year);
  if (year > 2014) {
    return 510;
  } else if (year === 2014) {
    return 545;
  } else if (year > 2010) {
    return 584;
  } else {
    return 583;
  }
}

function setImageMinHeight(year) {
  year = parseInt(year);
  if (year >= 2018) {
    return "255.5px";
  } else if (year >= 2014) {
    return "253.5px";
  } else {
    return "291.5px";
  }
}

export { setRowMinHeight };
export const ImageRow = withFirebase(PlainImageRow);
