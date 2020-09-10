import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { AuthUserContext } from "../Session";

import SignOutButton from "../SignOut";
import LightSwitch from "../LightSwitch";

import { lightSwitch } from "./Navbar.module.css";

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
        <Nav className={lightSwitch}>
          <LightSwitch />
        </Nav>
        <AuthUserContext.Consumer>
          {(authUser) =>
            authUser && !authUser.isAnonymous ? (
              <Nav>
                <LinkContainer to={ROUTES.ADMIN}>
                  <Nav.Link>Admin</Nav.Link>
                </LinkContainer>
                <SignOutButton />
              </Nav>
            ) : null
          }
        </AuthUserContext.Consumer>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;
