import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { AuthUserContext } from "../Session";

import SignOutButton from "../SignOut";

import * as ROUTES from "../../constants/routes.js";

function AppNavbar(props) {
  return (
    <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
      <LinkContainer to={ROUTES.HOME}>
        <Navbar.Brand>Arkiv</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to={ROUTES.SEARCH}>
            <Nav.Link>Søk</Nav.Link>
          </LinkContainer>
          <Nav.Link href="https://abakus.no/">Abakus.no</Nav.Link>
        </Nav>
        <AuthUserContext.Consumer>
          {authUser =>
            authUser ? (
              <Nav>
                <LinkContainer to={ROUTES.ADMIN}>
                  <Nav.Link>Admin</Nav.Link>
                </LinkContainer>
                <SignOutButton />
              </Nav>
            ) : (
              <Nav>
                <LinkContainer to={ROUTES.SIGN_IN}>
                  <Nav.Link>Sign in</Nav.Link>
                </LinkContainer>
              </Nav>
            )
          }
        </AuthUserContext.Consumer>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;
