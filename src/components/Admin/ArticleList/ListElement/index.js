import React from "react";

import { elementStyle, end, open, edit } from "./ListElement.module.css";
import DeleteButton from "../../Common/DeleteButton";

function ListElement({ obj, removeSelf }) {
  const { data, ref } = obj;
  const { edition, title, url } = data;
  return (
    <div className={elementStyle}>
      <p>
        {edition} | {title}
      </p>
      <div className={end}>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <i className={`material-icons md-36 ${open}`}>remove_red_eye</i>
        </a>
        <i className={`material-icons md-36 ${edit}`}>edit</i>
        <DeleteButton docRef={ref} removeSelf={() => removeSelf(obj)} />
      </div>
    </div>
  );
}

export default ListElement;
