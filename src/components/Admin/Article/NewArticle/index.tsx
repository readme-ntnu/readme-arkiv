import React, { FC } from "react";
import { Fade } from "react-bootstrap";
import { WithFirebaseProps } from "../../../Firebase/context";

import { withAuthorization } from "../../../Session";

import { ArticleForm } from "../ArticleForm";
import { ISubmitFunction } from "../types";

const PlainNewArticlePage: FC<WithFirebaseProps> = ({ firebase }) => {
  const doHandleSubmit: ISubmitFunction = (
    valuesToSubmit,
    { setSubmitting, setStatus }
  ) => {
    // Making a true copy to avoid pass-by-reference issues
    const values = JSON.parse(JSON.stringify(valuesToSubmit));
    values.pages = values.pages.split(",").map((v) => parseInt(v));
    values.tags = values.tags.split(",").map((v) => v.trim());
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
  };

  return (
    <>
      <Fade appear in>
        <h1>Ny artikkel</h1>
      </Fade>
      <ArticleForm doHandleSubmit={doHandleSubmit} />
    </>
  );
};

const condition = (authUser) => !!authUser && !authUser.isAnonymous;

export const NewArticlePage = withAuthorization(condition)(PlainNewArticlePage);
