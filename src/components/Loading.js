import React from "react";
import { Spinner } from "react-bootstrap";

import './Loading.css';

function Loading() {
  return (
    <div className="Loading">
      <Spinner animation="grow" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
      <div>Laster...</div>
    </div>
  );
}

export default Loading;
