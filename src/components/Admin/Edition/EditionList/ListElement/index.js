import React from "react";

import { elementStyle } from "./ListElement.module.css";
import DeleteButton from "../../../Common/DeleteButton";

function ListElement({ obj, removeSelf }) {
  const refs = [obj.imgRef, obj.pdfRef];

  return (
    <div className={elementStyle}>
      <p>{obj.edition}</p>
      <DeleteButton docRef={refs} removeSelf={() => removeSelf()} />
    </div>
  );
}

export default ListElement;
