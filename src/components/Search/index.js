import React, { useState } from "react";
import { debounce } from "lodash";
import { Spinner } from "react-bootstrap";

import Loading from "../Loading";
import AppTable from "./Table";

import { searchBox, search } from "./Search.module.css";

const searchForArticles = async searchString => {
  const host =
    process.env.NODE_ENV === "production"
      ? "https://us-central1-readme-arkiv.cloudfunctions.net/search"
      : "http://localhost:5000/readme-arkiv/us-central1/search";

  try {
    const res = await fetch(
      `${host}?searchString=${encodeURIComponent(searchString)}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
    const result = await res.json();
    return result.articles;
  } catch (error) {
    return [];
  }
};

function Search() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  const search = debounce(async searchString => {
    if (!searchString) {
      setArticles([]);
      setHasData(false);
      return;
    }
    setLoading(true);
    setHasData(false);
    const newArticles = await searchForArticles(searchString);
    setArticles(newArticles);
    setLoading(false);
    setHasData(true);
  }, 300);

  return (
    <>
      <h1>Artikkelsøk</h1>
      <div className={searchBox}>
        <input
          onChange={event => search(event.currentTarget.value)}
          placeholder="Søk..."
          size="32"
        />
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <i className={`material-icons md-36 ${search}`}>search</i>
        )}
      </div>
      {hasData ? <AppTable articles={articles} /> : null}
    </>
  );
}

export default Search;
