import React from "react";

import styles from "./ListElement.module.css";
import DeleteButton from "../../../Common/DeleteButton";

function ListElement({ obj, removeSelf }) {
  const refs = [obj.imgRef, obj.pdfRef];

  return (
    <div className={styles.elementStyle}>
      <p>{obj.edition}</p>
      <DeleteButton docRef={refs} removeSelf={() => removeSelf()} />
    </div>
  );
}

export default ListElement;
