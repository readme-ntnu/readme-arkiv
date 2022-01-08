import { useState, useEffect, FC } from "react";
import { useParams } from "react-router-dom";
import { Fade } from "react-bootstrap";
import { getDoc } from "firebase/firestore";

import { withAuthorization } from "../../../Session";

import { WithFirebaseProps } from "../../../Firebase/context";
import { Loading } from "../../../Loading";
import { IArticle, IEditArticle, ISubmitArticleFunction } from "../types";
import { ArticleForm } from "../ArticleForm";
import { User } from "firebase/auth";

const PlainEditArticle: FC<WithFirebaseProps> = ({ firebase }) => {
  const { id } = useParams<{ id: string }>();

  const [article, setArticle] = useState<IEditArticle>();
  const [downloading, setDownloading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      const articleDoc = await getDoc(firebase.article(id));

      const article = articleDoc.data() as IArticle;
      const [editionYear, editionNumber] = article.edition.split("-");
      const editArticle: IEditArticle = {
        ...article,
        editionYear: Number(editionYear),
        editionNumber: Number(editionNumber),
        pages: article.pages.join(", "),
        tags: article.tags.join(", "),
      };
      if (isSubscribed) {
        setArticle(editArticle);
        setDownloading(false);
      }
    };
    fetchData();
    return () => {
      isSubscribed = false;
    };
  }, [firebase, id]);

  const doHandleSubmit: ISubmitArticleFunction = (
    valuesToPost,
    { setSubmitting, setStatus }
  ) => {
    const values: IArticle = {
      ...valuesToPost,
      pages: valuesToPost.pages.split(",").map((v) => parseInt(v)),
      tags: valuesToPost.tags.split(",").map((v) => v.trim()),
      edition: `${valuesToPost.editionYear}-0${valuesToPost.editionNumber}`,
      _id: id,
    };
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
  };

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
};

const condition = (authUser: User) => !!authUser && !authUser.isAnonymous;

export const EditArticle = withAuthorization(condition)(PlainEditArticle);
