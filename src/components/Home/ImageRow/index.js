import React, { useState, useEffect } from "react";
import { withFirebase } from "../../Firebase";
import Loading from "../../Loading";

import { Image } from "react-bootstrap";
import FadeIn from "react-lazyload-fadein";

import "./ImageRow.css";

function ImageRow({ year, firebase }) {
  const [downloading, setDownloading] = useState(true);
  const [info, setInfo] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let isSubscribed = true;
      setDownloading(true);
      const info = await fetchDataForYear(year, firebase.storage);
      console.log(info);
      if (isSubscribed) {
        setInfo(info);
        setDownloading(false);
      }
      return () => (isSubscribed = false);
    }
    fetchData();
  }, [firebase.storage, year]);

  let images, imagesLen, images1, images2;

  if (info.urls) {
    images = info.urls.map((url, index) => {
      return (
        <a
          className="RowImage"
          key={url}
          href={info.pdfs[index]}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={url} fluid />
        </a>
      );
    });

    imagesLen = images.length;
    images1 = images.slice(0, 3);
    images2 = images.slice(3, imagesLen);
  }

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

  function setImageMinHeight(year) {
    year = parseInt(year);
    if (year >= 2014) {
      return "245px";
    } else {
      return "283px";
    }
  }

  return (
    <div className="ImageRow">
      {downloading ? (
        <Loading
          styles={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: setRowMinHeight(year.name),
            marginBottom: "15px"
          }}
        />
      ) : (
        <FadeIn height={setRowMinHeight(year.name)}>
          {onLoad => (
            <div style={{ minHeight: setRowMinHeight(year.name) }}>
              <div onLoad={onLoad} className="row">
                {images1}
              </div>
              {images2 && images2.length ? (
                <div onLoad={onLoad} className="row">
                  {images2}
                </div>
              ) : null}
            </div>
          )}
        </FadeIn>
      )}
    </div>
  );
}
async function fetchDataForYear(yearPrefix, storage) {
  let object = {};
  let response = await Promise.all([
    fetchImagesForAYear(yearPrefix),
    fetchPDFsForAYear(yearPrefix, storage)
  ]);
  object["year"] = yearPrefix.name;
  object["urls"] = response[0];
  object["pdfs"] = response[1];
  return object;
}

async function fetchImagesForAYear(yearPrefix) {
  let imgRefs = await yearPrefix.list();
  let imgRefsItems = imgRefs.items.reverse();
  let urls = await Promise.all(imgRefsItems.map(ref => ref.getDownloadURL()));
  return urls;
}

async function fetchPDFsForAYear(yearPrefix, storage) {
  let year = yearPrefix.name;
  let PDFRefs = await storage.ref("pdf/" + year).list();
  let PDFRefsItems = PDFRefs.items.reverse();
  const pdfUrls = await Promise.all(
    PDFRefsItems.map(ref => ref.getDownloadURL())
  );
  return pdfUrls;
}

export default withFirebase(ImageRow);
