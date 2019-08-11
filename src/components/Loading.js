import React from "react";
import { css } from '@emotion/core';

import { Fade } from "react-bootstrap";
import { BounceLoader } from "react-spinners";

import "./Loading.css";

const override = css`
    display: block;
    margin: 0 auto;
`;

function Loading() {
  return (
    <Fade appear in>
      <div className="Loading">
        <BounceLoader css={override} animation="grow" role="status">
          <span className="sr-only">Loading...</span>
        </BounceLoader>
        <div>Laster...</div>
      </div>
    </Fade>
  );
}

export default Loading;
