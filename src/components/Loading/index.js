import React from "react";

import { Fade, Spinner } from "react-bootstrap";

import "./Loading.css";

function Loading() {
  return (
    <Fade appear in>
      <div className="Loading">
        <Spinner animation="grow" />
        <div>Laster...</div>
      </div>
    </Fade>
  );
}

export default Loading;
