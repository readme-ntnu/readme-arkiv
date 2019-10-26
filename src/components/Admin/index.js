import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "react-bootstrap";

import { withAuthorization } from "../Session";

import * as ROUTES from "../../constants/routes";
import "./AdminPage.css";

class AdminPage extends Component {
  render() {
    return (
      <div>
        <h1>Admin</h1>
        <div className="buttonContainer">
          <LinkContainer to={ROUTES.NEW_EDITION}>
            <Button variant="primary" block>
              Legg til ny utgave
            </Button>
          </LinkContainer>
          <LinkContainer to={ROUTES.NEW_ARTICLE}>
            <Button variant="primary" block>
              Legg til ny artikkel
            </Button>
          </LinkContainer>
        </div>
      </div>
    );
  }
}
const condition = authUser => !!authUser;

export default withAuthorization(condition)(AdminPage);
