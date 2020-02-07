import React from "react";
import { Image } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { app, readmelogo, lightSwitch, header } from "./App.module.css";

import * as ROUTES from "./constants/routes";

import AppNavBar from "./components/Navbar";
import Home from "./components/Home";
import Search from "./components/Search";
import SignInPage from "./components/SignIn";
import PasswordForgetPage from "./components/PasswordForget";
import AdminPage from "./components/Admin";
import NewEditionPage from "./components/Admin/Edition/NewEdition";
import EditionList from "./components/Admin/Edition/EditionList";
import NewArticlePage from "./components/Admin/Article/NewArticle";
import EditArticle from "./components/Admin/Article/EditArticle";
import ArticleList from "./components/Admin/Article/ArticleList";
import LightSwitch from "./components/LightSwitch";

import NoMatch from "./components/NoMatch";
import { withAuthentication } from "./components/Session";

function App() {
  return (
    <Router>
      <div className={app}>
        <AppNavBar />
        <header className={header}>
          <Image
            className={readmelogo}
            src={`${process.env.PUBLIC_URL}/readme.png`}
            alt="Logo"
            fluid
          />
          <div className={lightSwitch}>
            <LightSwitch />
          </div>
        </header>
        <Switch>
          <Route exact path={ROUTES.HOME} component={Home} />
          <Route path={ROUTES.SEARCH} component={Search} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
          <Route path={ROUTES.NEW_EDITION} component={NewEditionPage} />
          <Route path={ROUTES.EDITION_LIST} component={EditionList} />
          <Route path={ROUTES.NEW_ARTICLE} component={NewArticlePage} />
          <Route path={ROUTES.EDIT_ARTICLE} component={EditArticle} />
          <Route path={ROUTES.ARTICLE_LIST} component={ArticleList} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    </Router>
  );
}

export default withAuthentication(App);
