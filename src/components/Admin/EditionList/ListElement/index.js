import React from "react";
import { elementStyle, deleteButton } from "./ListElement.module.css";

function ListElement({ obj }) {
  return (
    <div className={elementStyle}>
      <p>{obj.edition}</p>
      <i
        className={`material-icons md-36 ${deleteButton}`}
        onClick={async () => {
          await obj.imgRef.delete();
          await obj.pdfRef.delete();
        }}
      >
        delete_outline
      </i>
    </div>
  );
}

export default ListElement;
