import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

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
import { ReadmeLogo } from "./components/ReadmeLogo";

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <AppNavbar />
        <header className={styles.header}>
          <div className={styles.readmelogo}>
            <ReadmeLogo maxWidth={"min(700px, 100%)"} />
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
