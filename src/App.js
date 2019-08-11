import React, { useState } from "react";
import { debounce } from "lodash";
import "./App.css";

import { Table } from "react-bootstrap";

import AppNavBar from "./components/Navbar.js";
import Loading from "./components/Loading.js";
import AppTable from "./components/Table.js";

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

function App() {
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
    <div className="App">
      <AppNavBar />
      <header className="App-header">
        <img src="readme.png" alt="Logo" />
        <h1>Artikkelsøk</h1>
      </header>
      <div>
        <input
          onChange={event => search(event.currentTarget.value)}
          placeholder="Søk..."
        />
        {loading ? <Loading /> : null}
        {hasData ? <AppTable articles={articles} /> : null}
      </div>
    </div>
  );
}

export default App;
