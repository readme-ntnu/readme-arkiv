import React, { useState } from "react";
import { Spinner } from "react-bootstrap";

import { deleteButton } from "./DeleteButton.module.css";

function DeleteButton({ docRef, removeSelf }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteItem() {
    setIsDeleting(true);
    if (docRef.length) {
      for (let ref of docRef) {
        await ref.delete();
      }
    } else {
      await docRef.delete();
    }
    setIsDeleting(false);
    removeSelf();
  }

  return (
    <div className={deleteButton}>
      {isDeleting ? (
        <Spinner animation="border" />
      ) : (
        <i className={"material-icons md-36"} onClick={() => deleteItem()}>
          delete_outline
        </i>
      )}
    </div>
  );
}

export default DeleteButton;
