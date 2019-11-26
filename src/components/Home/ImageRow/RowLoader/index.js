import React from "react";
import Loading from "../../../Loading";

function RowLoader({ minHeight }) {
  return (
    <Loading
      styles={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: `${minHeight}px`,
        marginBottom: "15px"
      }}
    />
  );
}

export default RowLoader;
