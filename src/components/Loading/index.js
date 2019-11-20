import React from "react";

import { Fade, Spinner } from "react-bootstrap";

import "./Loading.css";

function Loading({ styles }) {
  return (
    <Fade appear in>
      <div className="Loading" style={styles || {}}>
        <Spinner animation="grow" />
        <div>Laster...</div>
      </div>
    </Fade>
  );
}

export default Loading;
