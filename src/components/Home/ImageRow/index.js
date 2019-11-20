import React from "react";

import { Image } from "react-bootstrap";
import FadeIn from "react-lazyload-fadein";
import "firebase/storage";

import "./ImageRow.css";

function ImageRow(props) {
  let images = props.info.urls.map((url, index) => {
    return (
      <div className="RowImage" key={url}>
        <a
          href={props.info.pdfs[index]}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={url} fluid />
        </a>
      </div>
    );
  });

  let imagesLen = images.length;
  let images1 = images.slice(0, 3);
  let images2 = images.slice(3, imagesLen);
  return (
    <div className="ImageRow">
      <h2 className="year">{props.info.year}</h2>
      <FadeIn height={250}>
        {onload => (
          <div onLoad={onload}>
            <div className="row">{images1}</div>
            {images2.length ? <div className="row">{images2}</div> : null}
          </div>
        )}
      </FadeIn>
    </div>
  );
}

export default ImageRow;
