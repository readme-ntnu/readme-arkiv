import React from "react";

import {
  elementStyle,
  end,
  deleteButton,
  open,
  edit
} from "./ListElement.module.css";

function ListElement({ obj }) {
  const { edition, title, url } = obj.data;
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
        <i className={`material-icons md-36 ${deleteButton}`}>delete_outline</i>
      </div>
    </div>
  );
}

export default ListElement;
