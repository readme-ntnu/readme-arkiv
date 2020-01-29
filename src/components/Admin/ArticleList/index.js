import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchData = async () => {
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
    };
    fetchData();
  }, [query]);

  function prevPage(first) {
    setQuery(baseQuery.endBefore(first[field]).limitToLast(pageSize));
  }

  function nextPage(last) {
    setQuery(baseQuery.startAfter(last[field]).limit(pageSize));
  }

  if (downloading) {
    return <Loading />;
  } else {
    return (
      <>
        {data.map(article => (
          <ListElement obj={article} />
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
