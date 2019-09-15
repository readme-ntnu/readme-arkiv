import React from "react";

import { Image } from "react-bootstrap";

function ImageRow(props) {
  let images = props.info.urls.map(url => {
    return <Image src={url} fluid />;
  });
  return (
    <div>
      <h2>{props.info.year}</h2>
      {images}
    </div>
  );
}

export default ImageRow;
