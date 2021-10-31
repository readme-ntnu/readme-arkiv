import React, { useState, useEffect, useCallback } from "react";
import { withAuthorization } from "../../../Session";
import { Button, Fade } from "react-bootstrap";

import Loading from "../../../Loading";
import ListElement from "./ListElement";

import styles from "./ArticleList.module.css";

function ArticleList({ firebase }) {
  const firstField = "edition";
  const secondField = "pages";
  let pageSize = 20;

  const baseQuery = firebase
    .articles()
    .orderBy(firstField, "desc")
    .orderBy(secondField, "desc");

  const [query, setQuery] = useState(baseQuery.limit(pageSize));

  const [data, setData] = useState([]);
  const [pageNum, setPageNum] = useState(0);

  const [downloading, setDownloading] = useState(true);

  const fetchData = useCallback(async () => {
    let subscribed = true;
    setDownloading(true);
    const response = await query.get();
    const responseData = [];
    response.forEach((doc) => {
      responseData.push({
        id: doc.id,
        data: doc.data(),
        ref: doc.ref,
      });
    });
    if (subscribed && responseData.length > 0) {
      setData(responseData);
    }
    setDownloading(false);
    return () => (subscribed = false);
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function prevPage(first) {
    setPageNum(pageNum - 1);
    setQuery(
      baseQuery
        .endBefore(first[firstField], first[secondField])
        .limitToLast(pageSize)
    );
  }

  function nextPage(last) {
    setPageNum(pageNum + 1);
    setQuery(
      baseQuery.startAfter(last[firstField], last[secondField]).limit(pageSize)
    );
  }

  function removeItem(article) {
    setData(data.filter((element) => element.data._id !== article.data._id));
  }

  return (
    <Fade in appear>
      <div className={styles.articleList}>
        <h1>Artikler</h1>
        {downloading ? (
          <Loading />
        ) : (
          <>
            {data.map((article, i) => (
              <ListElement key={i} obj={article} removeSelf={removeItem} />
            ))}

            <div className={styles.pagination}>
              <Button
                disabled={pageNum === 0}
                onClick={() => prevPage(data[0].data)}
              >
                &lt;&lt;
              </Button>
              <Button onClick={() => nextPage(data[data.length - 1].data)}>
                &gt;&gt;
              </Button>
            </div>
          </>
        )}
      </div>
    </Fade>
  );
}

const condition = (authUser) => !!authUser && !authUser.isAnonymous;

export default withAuthorization(condition)(ArticleList);
