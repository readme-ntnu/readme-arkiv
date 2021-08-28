import React from "react";

import { Highlight } from "react-instantsearch-dom";

import styles from "./Hit.module.css";

function Hit({ hit }) {
  return (
    <div className={styles.hit}>
      <div className="hit-edition">
        <Highlight attribute="edition" hit={hit} />
      </div>
      <div className="hit-name">
        <Highlight attribute="title" hit={hit} />
      </div>
      <div className="hit-author">
        <Highlight attribute="author" hit={hit} />
      </div>
      <div className="hit-layout">
        <Highlight attribute="layout" hit={hit} />
      </div>
      <div className="hit-photo">
        <Highlight attribute="photo" hit={hit} />
      </div>
    </div>
  );
}

export default Hit;
