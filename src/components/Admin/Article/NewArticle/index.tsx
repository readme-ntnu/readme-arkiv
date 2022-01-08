import { User } from "firebase/auth";
import React, { FC } from "react";
import { Fade } from "react-bootstrap";
import { WithFirebaseProps } from "../../../Firebase/context";

import { withAuthorization } from "../../../Session";

import { ArticleForm } from "../ArticleForm";
import { IArticle, ISubmitArticleFunction } from "../types";

const PlainNewArticlePage: FC<WithFirebaseProps> = ({ firebase }) => {
  const doHandleSubmit: ISubmitArticleFunction = (
    valuesToPost,
    { setSubmitting, setStatus }
  ) => {
    // Making a true copy to avoid pass-by-reference issues
    const values: IArticle = {
      ...valuesToPost,
      pages: valuesToPost.pages.split(",").map((v) => parseInt(v)),
      tags: valuesToPost.tags.split(",").map((v) => v.trim()),
      edition: `${valuesToPost.editionYear}-0${valuesToPost.editionNumber}`,
    };
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

const condition = (authUser: User) => !!authUser && !authUser.isAnonymous;

export const NewArticlePage = withAuthorization(condition)(PlainNewArticlePage);
