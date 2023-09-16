import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Navbar.js';
import Cart from './components/Cart.js';
import { Routes, Route } from 'react-router-dom';
import RegisterProduct from './components/RegisterProduct.js';
import { ethers } from 'ethers';

class App extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
      cartContract: null,
      marketplaceContract: null,
      provider: null,
      userAddress: null,
    };
  }

  async componentDidMount() {
    try {
      // Connect to an Ethereum provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      this.setState({ provider });

      // Fetch the user's Ethereum address
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = account;
      this.setState({ userAddress });

      // Create a signer using the user's Ethereum address
      const signer = provider.getSigner();

      // Load the Cart contract
      const abi1 = [{"name":"CheckoutCompleted","inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"totalCost","type":"uint256"}],"type":"event"},{"name":"ItemAddedToCart","inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"itemId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"quantity","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"address","name":"buyerId","type":"address"},{"indexed":false,"internalType":"address","name":"sellerId","type":"address"}],"type":"event"},{"name":"addItemToCart","inputs":[{"internalType":"uint256","name":"itemId","type":"uint256"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"address","name":"buyerId","type":"address"},{"internalType":"address","name":"sellerId","type":"address"}],"type":"function","stateMutability":"nonpayable"},{"name":"calculateTotalCost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"type":"function","stateMutability":"view"},{"name":"carts","inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"outputs":[{"internalType":"uint256","name":"itemId","type":"uint256"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"address","name":"buyerId","type":"address"},{"internalType":"address","name":"sellerId","type":"address"}],"type":"function","stateMutability":"view"},{"name":"checkout","type":"function","stateMutability":"payable"},{"name":"clearCart","type":"function","stateMutability":"nonpayable"},{"name":"getCartItemCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"type":"function","stateMutability":"view"}];
      const cartContractAddress = "0x55b4aA2774DE4C29858FF751789A04CdDe6498Ca"; // Replace with your contract address
      const cartContract = new ethers.Contract(
        cartContractAddress,
        abi1,
        signer // Use the signer here
      );
      this.setState({ cartContract });

      // Load the Marketplace contract
      const abi2 = [{"type":"constructor","stateMutability":"nonpayable"},{"name":"ProductCreated","inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"quantity","type":"uint256"},{"indexed":false,"internalType":"address","name":"seller","type":"address"}],"type":"event"},{"name":"ProductPurchased","inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"quantity","type":"uint256"},{"indexed":false,"internalType":"address","name":"buyer","type":"address"}],"type":"event"},{"name":"listProduct","inputs":[{"internalType":"uint256","name":"_productId","type":"uint256"}],"type":"function","stateMutability":"nonpayable"},{"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"type":"function","stateMutability":"view"},{"name":"productCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"type":"function","stateMutability":"view"},{"name":"products","inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"buyer","type":"address"},{"internalType":"bool","name":"isSold","type":"bool"}],"type":"function","stateMutability":"view"},{"name":"purchaseProduct","inputs":[{"internalType":"uint256","name":"_productId","type":"uint256"},{"internalType":"uint256","name":"_quantity","type":"uint256"}],"type":"function","stateMutability":"nonpayable"},
      {"name":"registerProduct","inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_quantity","type":"uint256"}],"type":"function","stateMutability":"nonpayable"}]; // Your Marketplace contract ABI
      const marketplaceContractAddress = "0x6537535d034102d714f9263698DEB6BEbc99254B"; // Replace with your contract address
      const marketplaceContract = new ethers.Contract(
        marketplaceContractAddress,
        abi2,
        provider
      );
      this.setState({ marketplaceContract });

      // Load product data from the Marketplace contract
      const productCount = await marketplaceContract.productCount();
      const products = [];
      for (let i = 1; i <= productCount; i++) {
        const product = await marketplaceContract.products(i);
        products.push({
          id: product.id.toNumber(),
          name: product.name,
          price: ethers.utils.formatEther(product.price),
          quantity: product.quantity.toNumber(),
        });
      }
      this.setState({ products });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async handleAddToCart(productId) {
    try {
      // Check if the user is connected to an Ethereum wallet
      if (!this.state.userAddress) {
        alert('Please connect your Ethereum wallet.');
        return;
      }
  
      // Use the signer when sending the transaction
      const signer = this.state.provider.getSigner();
  
      // Fetch product details from the Marketplace contract
      const product = await this.state.marketplaceContract.products(productId);
      const itemId = productId;
      const quantity = 1; // Replace with the desired quantity
      const price = product.price; // Use the actual price from the Marketplace contract
      const buyerId = this.state.userAddress;
      const sellerId = product.seller; // Use the seller's address from the Marketplace contract
  
      const cartContractWithSigner = this.state.cartContract.connect(signer);
  
      const tx = await cartContractWithSigner.addItemToCart(
        itemId,
        quantity,
        price,
        buyerId,
        sellerId,
      );
      await tx.wait();
      alert('Item added to cart successfully.');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Error adding item to cart.');
    }
  }  

  render() {
    return (
      <div className="App">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<Home products={this.state.products} onAddToCart={(productId) => this.handleAddToCart(productId)} />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/registerproduct" element={<RegisterProduct marketplaceContract={this.state.marketplaceContract} />} />
        </Routes>
      </div>
    );
  }
}

function Home({ products, onAddToCart }) {
  return (
    <div className="Product-list">
      {products && products.length > 0 ? (
        products.map((product) => (
          <div className="Product" key={product.id}>
            <img
              className="Product-image"
              src={`https://via.placeholder.com/150?text=${product.name}`}
              alt={product.name}
            />
            <h2 className="Product-name">{product.name}</h2>
            <p className="Product-price">Price: {product.price} ETH</p>
            <p className="Product-quantity">Quantity: {product.quantity}</p>
            <button className="Add-to-cart-button" onClick={() => onAddToCart(product.id)}>Add to Cart</button>
          </div>
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
}

export default App;
