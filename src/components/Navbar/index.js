import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import * as ROUTES from "../../constants/routes.js";

function AppNavbar() {
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
        <Nav>
          <LinkContainer to={ROUTES.SIGN_IN}>
            <Nav.Link>Sign in</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;
