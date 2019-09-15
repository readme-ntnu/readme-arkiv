import React, { useState } from "react";
import { Image } from "react-bootstrap";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";

import AppNavBar from "./components/Navbar";
import Home from "./components/Home.js";
import Search from "./components/Search.js";

function App() {
  return (
    <Router>
      <div className="App">
        <AppNavBar />
        <header className="App-header">
          <Image id="readmelogo" src="readme.png" alt="Logo" responsive />
        </header>
        <Route exact path="/" component={Home} />
        <Route path="/search" component={Search} />
      </div>
    </Router>
  );
}

export default App;
