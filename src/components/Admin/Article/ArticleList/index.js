import React, { useState, useEffect, useCallback } from "react";
import { withAuthorization } from "../../../Session";

import Loading from "../../../Loading";
import ListElement from "./ListElement";

import { articleList, pagination } from "./ArticleList.module.css";
import { Button } from "react-bootstrap";

function ArticleList({ firebase }) {
  const field = "edition";
  let pageSize = 20;

  const baseQuery = firebase.articles().orderBy(field, "desc");

  const [query, setQuery] = useState(baseQuery.limit(pageSize));

  const [data, setData] = useState([]);
  const [pageNum, setPageNum] = useState(0);

  const [downloading, setDownloading] = useState(true);

  const fetchData = useCallback(async () => {
    let subscribed = true;
    setDownloading(true);
    const response = await query.get();
    const responseData = [];
    response.forEach(doc => {
      responseData.push({
        id: doc.id,
        data: doc.data(),
        ref: doc.ref
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
    setQuery(baseQuery.endBefore(first[field]).limitToLast(pageSize));
  }

  function nextPage(last) {
    setPageNum(pageNum + 1);
    setQuery(baseQuery.startAfter(last[field]).limit(pageSize));
  }

  function removeItem(article) {
    setData(data.filter(element => element.data._id !== article.data._id));
  }

  if (downloading) {
    return <Loading />;
  } else {
    return (
      <div className={articleList}>
        <h2>Artikler</h2>
        {data.map((article, i) => (
          <ListElement key={i} obj={article} removeSelf={removeItem} />
        ))}
        <div className={pagination}>
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
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ArticleList);
