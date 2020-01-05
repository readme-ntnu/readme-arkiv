import React from "react";
import { elementStyle, deleteButton } from "./ListElement.module.css";

function ListElement({ element }) {
  return (
    <div className={elementStyle}>
      <p>{element.edition}</p>
      <i
        className={`material-icons md-36 ${deleteButton}`}
        onClick={() => element.ref.delete()}
      >
        delete_outline
      </i>
    </div>
  );
}

export default ListElement;
