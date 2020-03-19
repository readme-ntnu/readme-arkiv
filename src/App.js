import React, { useState } from "react";
import { debounce } from "lodash";
import { Image } from "react-bootstrap";
import "./App.css";

import AppNavBar from "./components/Navbar.js";
import Loading from "./components/Loading.js";
import AppTable from "./components/Table.js";

import { useAnonymousLogin } from './auth'

const searchForArticles = async (searchString, token) => {
  const host =
  process.env.NODE_ENV === "production"
  ? "https://us-central1-readme-arkiv.cloudfunctions.net/search"
  : "http://localhost:5000/readme-arkiv/us-central1/search";

  try {
    if (!token) {
      throw new Error('No token, so why even bother?')
    }

    const res = await fetch(
      `${host}?searchString=${encodeURIComponent(searchString)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      }
    );
    const result = await res.json();
    return result.articles || [];
  } catch (error) {
    return [];
  }
};

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  const { token } = useAnonymousLogin()

  const search = debounce(async searchString => {
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
    <div className="App">
      <AppNavBar />
      <header className="App-header">
        <Image id="readmelogo" src="readme.png" alt="Logo" responsive />
        <h1>Artikkelsøk</h1>
      </header>
      <div>
        <input
          onChange={event => search(event.currentTarget.value)}
          placeholder="Søk..."
          size="32"
        />
        {loading ? <Loading /> : null}
        {hasData ? <AppTable articles={articles} /> : null}
      </div>
    </div>
  );
}

export default App;
