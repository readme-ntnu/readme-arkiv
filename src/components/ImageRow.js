import React from "react";

import { Image } from "react-bootstrap";

import "./ImageRow.css";

function ImageRow(props) {
  let images = props.info.urls.map(url => {
    return <Image className="RowImage" src={url} fluid key={url} />;
  });
  return (
    <div>
      <h2>{props.info.year}</h2>
      {images}
    </div>
  );
}

export default ImageRow;
