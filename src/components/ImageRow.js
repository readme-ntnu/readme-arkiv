import React from "react";

import { Image } from "react-bootstrap";

import "./ImageRow.css";

function ImageRow(props) {
  let images = props.info.urls.map(url => {
    return <Image className="RowImage" src={url} key={url} fluid />;
  });

  return (
    <div className="ImageRow">
      <h2>{props.info.year}</h2>
      <div className="row">{images}</div>
    </div>
  );
}

export default ImageRow;
