import React from "react";
import { withAuthorization } from "../../Session";

import ListElement from "./ListElement";

function EditionList({ firebase }) {
  return (
    <ListElement
      element={{
        edition: "2020-01",
        ref: {
          delete: () => console.log("I was deleted!")
        }
      }}
    />
  );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(EditionList);
