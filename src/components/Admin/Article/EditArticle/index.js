import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Fade } from "react-bootstrap";

import { withAuthorization } from "../../../Session";

import ArticleForm from "../ArticleForm";
import Loading from "../../../Loading";

function EditArticle({ firebase }) {
  const { id } = useParams();

  const [article, setArticle] = useState({});
  const [downloading, setDownloading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      const articleDoc = await firebase.article(id).get();
      const article = articleDoc.data();
      const [editionYear, editionNumber] = article.edition.split("-");
      article.editionYear = Number(editionYear);
      article.editionNumber = Number(editionNumber);
      article.pages = article.pages.join(", ");
      article.tags = article.tags.join(", ");
      delete article.edition;
      if (isSubscribed) {
        setArticle(article);
        setDownloading(false);
      }
    };
    fetchData();
    return () => (isSubscribed = false);
  }, [firebase, id]);

  function doHandleSubmit(valuesToPost, { setSubmitting, setStatus }) {
    // Make a proper copy to avoid pass-by-reference issues
    const values = JSON.parse(JSON.stringify(valuesToPost));
    values.pages = values.pages.split(",").map((v) => parseInt(v));
    values.tags = values.tags.split(",").map((v) => v.trim());
    values.edition = `${values.editionYear}-0${values.editionNumber}`;
    values._id = id;
    delete values.editionYear;
    delete values.editionNumber;
    firebase.updateArticle(
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
        <h1>Oppdater artikkel</h1>
      </Fade>
      {downloading ? (
        <Loading />
      ) : (
        <ArticleForm doHandleSubmit={doHandleSubmit} article={article} />
      )}
    </>
  );
}

const condition = (authUser) => !!authUser && !authUser.isAnonymous;

export default withAuthorization(condition)(EditArticle);
