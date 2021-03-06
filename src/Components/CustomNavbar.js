import React, {Component} from 'react'
import { Navbar, Nav } from "react-bootstrap"
import '../App.css'

export default class CustomNav extends Component {

  render () {
    return (
      <div class="navbar-brand">
        <nav class="fixed-top">
          <Navbar class="Navbar-style" bg="dark" variant="dark" >
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav> 
                <Nav.Item>
                  <Nav.Link href="/">Home</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/about">About</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/resume">Resume</Nav.Link>
                </Nav.Item>
                <Nav.Item >
                  <Nav.Link href="/serviceDashboard">Car Service History Service</Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </nav>
      </div>
    );
  }
}