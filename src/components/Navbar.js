import React from "react";
import { Navbar, Nav, NavItem } from "react-bootstrap";

function AppNavbar() {
  return (
    <Navbar staticTop inverse>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="http://readme.abakus.no/">Arkiv</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav className="mr-auto">
          <NavItem eventKey={1} href="https://readme-arkiv.web.app/">
            Søk
          </NavItem>
          <NavItem eventKey={2} href="https://abakus.no/">
            Abakus.no
          </NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;
