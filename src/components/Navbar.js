import React from "react";
import { Navbar, Nav, NavItem } from "react-bootstrap";

function AppNavbar() {
  return (
    <Navbar inverse collapseOnSelect>
      <Navbar.Brand><a href="http://readme.abakus.no/"><b>Arkiv</b></a></Navbar.Brand>
      <Navbar.Toggle/>
      <Navbar.Collapse>
        <Nav className="mr-auto">
          <NavItem eventKey={1} href="https://readme-arkiv.web.app/">Søk</NavItem>
          <NavItem eventKey={2} href="https://abakus.no/">Abakus.no</NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;
