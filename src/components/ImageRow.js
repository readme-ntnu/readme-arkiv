import React from "react";

import { Image } from "react-bootstrap";

import "./ImageRow.css";

function ImageRow(props) {
  let images = props.info.urls.map(url => {
    return <Image className="RowImage" src={url} key={url} fluid />;
  });

  let imagesLen = images.length;
  let images1 = images.slice(0, imagesLen - 3);
  let images2 = images.slice(imagesLen - 3, imagesLen);
  return (
    <div className="ImageRow">
      <h2>{props.info.year}</h2>
      <div className="row">{images1}</div>
      <div className="row">{images2}</div>
    </div>
  );
}

export default ImageRow;
