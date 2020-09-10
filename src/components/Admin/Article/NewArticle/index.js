import React from "react";
import { Fade } from "react-bootstrap";

import { withAuthorization } from "../../../Session";

import ArticleForm from "../ArticleForm";

function NewArticlePage({ firebase }) {
  function doHandleSubmit(valuesToSubmit, { setSubmitting, setStatus }) {
    // Making a true copy to avoid pass-by-reference issues
    const values = JSON.parse(JSON.stringify(valuesToSubmit));
    values.pages = values.pages.split(",").map(v => parseInt(v));
    values.tags = values.tags.split(",").map(v => v.trim());
    values.edition = `${values.editionYear}-0${values.editionNumber}`;
    delete values.editionYear;
    delete values.editionNumber;
    firebase.addArticle(
      values,
      () => {
        setSubmitting(false);
        setStatus({ success: true });
      },
      () => {
        setSubmitting(false);
        setStatus({ error: true });
      }
    );
  }

  return (
    <>
      <Fade appear in>
        <h1>Ny artikkel</h1>
      </Fade>
      <ArticleForm doHandleSubmit={doHandleSubmit} />
    </>
  );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(NewArticlePage);
