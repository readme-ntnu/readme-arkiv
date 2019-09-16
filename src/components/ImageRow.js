import React from "react";

import { Image, Fade } from "react-bootstrap";
import "firebase/storage";

import "./ImageRow.css";

function ImageRow(props) {
  let images = props.info.urls.map((url, index) => {
    return (
      <div className="RowImage" key={url}>
        <a href={props.info.pdfs[index]}>
          <Image src={url} fluid />
        </a>
      </div>
    );
  });

  let imagesLen = images.length;
  let images1 = images.slice(0, imagesLen - 3);
  let images2 = images.slice(imagesLen - 3, imagesLen);
  return (
    <Fade appear in>
      <div className="ImageRow">
        <h2 className="year">{props.info.year}</h2>
        <div className="row">{images1}</div>
        <div className="row">{images2}</div>
      </div>
    </Fade>
  );
}

export default ImageRow;
