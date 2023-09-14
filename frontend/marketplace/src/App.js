// src/App.js

import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Navbar.js';
import Cart from './components/Cart.js'; // Import the Cart component
import {Routes, Route } from 'react-router-dom';

class App extends Component {
  constructor() {
    super();
    this.state = {
      products: [
        { id: 1, name: 'Product 1', price: 1999 },
        { id: 2, name: 'Product 2', price: 2999 },
        { id: 3, name: 'Product 3', price: 3999 },
        // Add more products here
      ],
    };
  }

  render() {
    return (
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home products={this.state.products} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<OrderListing products={this.state.products} />} />
          </Routes>
        </div>
    );
  }
}

// Define the Home and ProductListing components
function Home({ products }) {
  return (
    <div className="Product-list">
      {products.map((product) => (
        <div className="Product" key={product.id}>
          <img
            className="Product-image"
            src={`https://via.placeholder.com/150?text=${product.name}`}
            alt={product.name}
          />
          <h2 className="Product-name">{product.name}</h2>
          <p className="Product-price">Rs.{product.price.toFixed(2)}</p>
          <button className="Add-to-cart-button">Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

function OrderListing({ products }) {
  // Render your product listing page here
  return (
    <div>
      {/* Add your product listing page content here */}
    </div>
  );
}

export default App;
