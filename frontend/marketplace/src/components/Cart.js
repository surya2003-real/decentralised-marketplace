// src/components/Cart.js

import React, { Component } from 'react';
import './Cart.css'; // Import the Cart component's CSS

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [
        { id: 1, name: 'Product 1', price: 1999, quantity: 2 },
        { id: 2, name: 'Product 2', price: 2999, quantity: 1 },
        // Add more cart items here
      ],
    };
  }

  render() {
    const { cartItems } = this.state;

    return (
      <div className="Cart">
        <h1>Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="Cart-items">
              {cartItems.map((item) => (
                <li key={item.id} className="Cart-item">
                  <div className='cart-item-image-container'>
                  <img
                    className="Cart-item-image"
                    src={`https://via.placeholder.com/100?text=${item.name}`}
                    alt={item.name}
                  />
                  </div>
                  <div className="cart-item-details">
                    <h2 className="cart-item-name">{item.name}</h2>
                    <p className="cart-item-price">Price: Rs.{item.price.toFixed(2)}</p>
                    <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="cart-total">
              Total: Rs.{" "}
              {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
            </p>
            <button className="checkout-button">Checkout</button>
          </>
        )}
      </div>
    );
  }
}

export default Cart;
