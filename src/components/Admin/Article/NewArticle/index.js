import React from "react";

import { withAuthorization } from "../../../Session";

import ArticleForm from "../ArticleForm";

function NewArticlePage({ firebase }) {
  function doHandleSubmit(values, { setSubmitting, setStatus }) {
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
      <h1>Ny artikkel</h1>
      <ArticleForm doHandleSubmit={doHandleSubmit} />
    </>
  );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(NewArticlePage);
