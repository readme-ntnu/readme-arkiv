import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Fade } from "react-bootstrap";

import { withAuthorization } from "../Session";

import * as ROUTES from "../../constants/routes";
import "./AdminPage.css";
import ShowListingToggle from "./ShowListingToggle";

function AdminPage() {
  return (
    <Fade appear in>
      <div>
        <h1>Admin</h1>
        <div className="buttonContainer">
          <LinkContainer to={ROUTES.NEW_EDITION}>
            <Button variant="primary" block>
              Legg til ny utgave
            </Button>
          </LinkContainer>
          <LinkContainer to={ROUTES.EDITION_LIST}>
            <Button variant="primary" block>
              Vis utgavelisten
            </Button>
          </LinkContainer>
          <LinkContainer to={ROUTES.NEW_ARTICLE}>
            <Button variant="primary" block>
              Legg til ny artikkel
            </Button>
          </LinkContainer>
          <LinkContainer to={ROUTES.ARTICLE_LIST}>
            <Button variant="primary" block>
              Vis artikkellisten
            </Button>
          </LinkContainer>

          <ShowListingToggle />
        </div>
      </div>
    </Fade>
  );
}

const condition = (authUser) => !!authUser && !authUser.isAnonymous;

export default withAuthorization(condition)(AdminPage);
