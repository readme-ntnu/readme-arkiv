import React, { CSSProperties, FC } from "react";
import useDarkMode from "use-dark-mode";

import { Fade, Spinner } from "react-bootstrap";

import "./Loading.css";

interface LoadingProps {
  msg?: string;
  style?: CSSProperties;
}

export const Loading: FC<LoadingProps> = ({ msg = "Laster...", style }) => {
  const darkmode = useDarkMode();
  return (
    <Fade appear in>
      <div className="Loading" style={style ?? {}}>
        <Spinner animation="grow" variant={darkmode.value ? "light" : "dark"} />
        <div>{msg}</div>
      </div>
    </Fade>
  );
};
