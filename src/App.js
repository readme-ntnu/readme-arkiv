import React from "react";
import { Image } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

import * as ROUTES from "./constants/routes";

import AppNavBar from "./components/Navbar";
import Home from "./components/Home";
import Search from "./components/Search";
import SignInPage from "./components/SignIn";
//import AdminPage from "../components/Admin.js";

import NoMatch from "./components/NoMatch";
import { withFirebase } from "./components/Firebase/context";

function App() {
  const HomeFire = withFirebase(Home);
  return (
    <Router>
      <div className="App">
        <AppNavBar />
        <header className="App-header">
          <Image id="readmelogo" src="readme.png" alt="Logo" fluid />
        </header>
        <Switch>
          <Route exact path={ROUTES.HOME} component={HomeFire} />
          <Route path={ROUTES.SEARCH} component={Search} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          {/*<Route path={ROUTES.ADMIN} component={AdminPage} />*/}
          <Route component={NoMatch} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
