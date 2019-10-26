import React from "react";
import { withFirebase } from "../Firebase";

import { Nav } from "react-bootstrap";

const SignOutButton = ({ firebase }) => (
  <Nav.Link type="button" onClick={firebase.doSignOut}>
    Sign Out
  </Nav.Link>
);
export default withFirebase(SignOutButton);
