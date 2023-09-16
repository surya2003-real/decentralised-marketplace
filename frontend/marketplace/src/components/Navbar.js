// src/components/Navbar.js

import React from 'react';
import './Navbar.css'; // Import the CSS file
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Navbar = () => {
  return (
    <nav className="Navbar">
      <div className="Navbar-links">
        <LinkContainer to="/"><Nav.Link className="navbar-link">Home</Nav.Link></LinkContainer>
        <LinkContainer to="/cart"><Nav.Link className="navbar-link">Cart</Nav.Link></LinkContainer>
        <LinkContainer to="/registerproduct"><Nav.Link className="navbar-link">Register Product</Nav.Link></LinkContainer>
      </div>
      <div className="Navbar-logo">
        <h2>Decentralised Marketplace</h2>
      </div>
      <div className="Navbar-search">
        <input type="text" placeholder="Search products..." />
        <button type="button">Search</button>
      </div>
    </nav>
  );
};

export default Navbar;
