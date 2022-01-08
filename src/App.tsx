import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import useDarkMode from "use-dark-mode";

import styles from "./App.module.css";

import * as ROUTES from "./constants/routes";

import { withAuthentication } from "./components/Session";
import { AdminPage } from "./components/Admin";
import { ArticleList } from "./components/Admin/Article/ArticleList";
import { EditArticle } from "./components/Admin/Article/EditArticle";
import { NewArticlePage } from "./components/Admin/Article/NewArticle";
import { EditionList } from "./components/Admin/Edition/EditionList";
import { NewEditionPage } from "./components/Admin/Edition/NewEdition";
import { Footer } from "./components/Footer";
import { PasswordForgetPage } from "./components/PasswordForget";
import { Search } from "./components/Search";
import { SignInPage } from "./components/SignIn";
import { AppNavbar } from "./components/Navbar";
import { Home } from "./components/Home";
import { NoMatch } from "./components/NoMatch";

function App() {
  const darkmode = useDarkMode();
  const logoSrc = `${process.env.PUBLIC_URL}/readme_hvit.png`;
  const blackLogoSrc = `${process.env.PUBLIC_URL}/readme.png`;

  return (
    <Router>
      <div className={styles.app}>
        <AppNavbar />
        <header className={styles.header}>
          <div className={styles.readmelogo}>
            <img
              style={{ maxHeight: "1em" }}
              src={logoSrc}
              alt="readmeLogoHvit"
            />
            ;
            <img
              style={{ maxHeight: "1em" }}
              src={blackLogoSrc}
              alt="readmeLogoHvit"
            />
          </div>
        </header>
        <div className={styles.content}>
          <Switch>
            <Route exact path={ROUTES.HOME} component={Home} />
            <Route path={ROUTES.SEARCH} component={Search} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route
              path={ROUTES.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
            <Route path={ROUTES.NEW_EDITION} component={NewEditionPage} />
            <Route path={ROUTES.EDITION_LIST} component={EditionList} />
            <Route path={ROUTES.NEW_ARTICLE} component={NewArticlePage} />
            <Route path={ROUTES.EDIT_ARTICLE} component={EditArticle} />
            <Route path={ROUTES.ARTICLE_LIST} component={ArticleList} />
            <Route component={NoMatch} />
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default withAuthentication(App);
