// src/components/Navbar.js

import React from 'react';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="Navbar">
      <div className="Navbar-links">
        <a href="/">Home</a>
        <a href="/cart">Cart</a>
        <a href="/registerproduct">Register Product</a>
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
