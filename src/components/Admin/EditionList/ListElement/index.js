import React, { useState } from "react";
import { Spinner } from "react-bootstrap";

import { elementStyle, deleteButton } from "./ListElement.module.css";

function ListElement({ obj, removeSelf }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteItem() {
    setIsDeleting(true);
    await obj.imgRef.delete();
    await obj.pdfRef.delete();
    setIsDeleting(false);
    removeSelf();
  }
  return (
    <div className={elementStyle}>
      <p>{obj.edition}</p>
      <div className={deleteButton}>
        {isDeleting ? (
          <Spinner animation="border" />
        ) : (
          <i className={"material-icons md-36"} onClick={() => deleteItem()}>
            delete_outline
          </i>
        )}
      </div>
    </div>
  );
}

export default ListElement;
