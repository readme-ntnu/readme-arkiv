import React from "react";
import { Navbar, Nav, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function AppNavbar() {
  return (
    <Navbar staticTop inverse>
      <Navbar.Header>
        <LinkContainer to="/">
          <Navbar.Brand>Arkiv</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav className="mr-auto">
          <LinkContainer to="/search">
            <NavItem eventKey={1} href="https://readme-arkiv.web.app/">
              Søk
            </NavItem>
          </LinkContainer>
          <NavItem eventKey={2} href="https://abakus.no/">
            Abakus.no
          </NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;
