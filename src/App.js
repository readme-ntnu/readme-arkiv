import React from "react";
import { Image } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

import AppNavBar from "./components/Navbar";
import Home from "./components/Home.js";
import Search from "./components/Search.js";
import NoMatch from "./components/NoMatch.js";

function App() {
  return (
    <Router>
      <div className="App">
        <AppNavBar />
        <header className="App-header">
          <Image id="readmelogo" src="readme.png" alt="Logo" fluid />
        </header>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/search" component={Search} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
