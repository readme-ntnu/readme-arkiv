import React, { useState, useEffect, useCallback } from "react";
import { withFirebase } from "../../Firebase";

import Loading from "../../Loading";
import ListElement from "./ListElement";

function ArticleList({ firebase }) {
  const field = "edition";
  let pageSize = 20;

  const baseQuery = firebase.articles().orderBy(field, "desc");

  const [query, setQuery] = useState(baseQuery.limit(pageSize));

  const [data, setData] = useState([]);

  const [downloading, setDownloading] = useState(true);

  const fetchData = useCallback(async () => {
    let subscribed = true;
    setDownloading(true);

    const response = await query.get();
    const responseData = [];
    response.forEach(doc => {
      responseData.push({
        data: doc.data(),
        ref: doc.ref
      });
    });
    if (subscribed) {
      setData(responseData);
      console.log(responseData);
      setDownloading(false);
    }
    return () => (subscribed = false);
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function prevPage(first) {
    setQuery(baseQuery.endBefore(first[field]).limitToLast(pageSize));
  }

  function nextPage(last) {
    setQuery(baseQuery.startAfter(last[field]).limit(pageSize));
  }

  function removeItem(article) {
    setData(data.filter(element => element.data._id !== article.data._id));
  }

  if (downloading) {
    return <Loading />;
  } else {
    return (
      <>
        {data.map(article => (
          <ListElement obj={article} removeSelf={removeItem} />
        ))}
        <button onClick={() => prevPage(data[0].data)}>Previous </button>
        <button onClick={() => nextPage(data[data.length - 1].data)}>
          Next
        </button>
      </>
    );
  }
}

export default withFirebase(ArticleList);
