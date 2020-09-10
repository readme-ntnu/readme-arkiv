import React from "react";
import useDarkMode from "use-dark-mode";

import { Fade, Spinner } from "react-bootstrap";

import "./Loading.css";

function Loading({ styles, msg = "Laster..." }) {
  const darkmode = useDarkMode();
  return (
    <Fade appear in>
      <div className="Loading" style={styles || {}}>
        <Spinner animation="grow" variant={darkmode.value ? "light" : "dark"} />
        <div>{msg}</div>
      </div>
    </Fade>
  );
}

export default Loading;
