import React, { useState } from "react";
import { debounce } from "lodash";
import { Spinner } from "react-bootstrap";
import { useAnonymousLogin } from "../Firebase";

import AppTable from "./Table";

import { searchBox, end } from "./Search.module.css";

const searchForArticles = async (searchString, token) => {
  const host =
    process.env.REACT_APP_USE_EMULATOR !== "1"
      ? "https://us-central1-readme-arkiv.cloudfunctions.net/api/search"
      : "http://localhost:5000/readme-arkiv/us-central1/api/search";

  try {
    if (!token) {
      throw new Error("No token, so why even bother?");
    }

    const res = await fetch(
      `${host}?searchString=${encodeURIComponent(searchString)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const result = await res.json();
    return result.articles || [];
  } catch (error) {
    return [];
  }
};

function Search() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  const { token } = useAnonymousLogin();

  const search = debounce(async (searchString) => {
    if (!searchString) {
      setArticles([]);
      setHasData(false);
      return;
    }
    setLoading(true);
    setHasData(false);
    const newArticles = await searchForArticles(searchString, token);
    setArticles(newArticles);
    setLoading(false);
    setHasData(true);
  }, 300);

  return (
    <>
      <h1>Artikkelsøk</h1>
      <div className={searchBox}>
        <input
          onChange={(event) => search(event.currentTarget.value)}
          placeholder="Søk..."
          size="32"
        />
        <div className={end}>
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <i className={`material-icons md-36 ${search}`}>search</i>
          )}
        </div>
      </div>
      {hasData ? <AppTable articles={articles} /> : null}
    </>
  );
}

export default Search;
