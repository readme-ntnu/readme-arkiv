import React from "react";
import { Navbar, Nav } from "react-bootstrap";

function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Navbar.Brand href="http://readme.abakus.no/"><b>Arkiv</b></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="https://readme-arkiv.web.app/">Søk</Nav.Link>
          <Nav.Link href="https://abakus.no/">Abakus.no</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;
