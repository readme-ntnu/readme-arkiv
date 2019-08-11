import React from "react";
import { Spinner, Fade } from "react-bootstrap";

import "./Loading.css";

function Loading() {
  return (
    <Fade appear in>
      <div className="Loading">
        <Spinner animation="grow" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
        <div>Laster...</div>
      </div>
    </Fade>
  );
}

export default Loading;
