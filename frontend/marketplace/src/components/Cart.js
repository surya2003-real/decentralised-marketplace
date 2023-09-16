import React, { Component } from 'react';
import './Cart.css';
import { ethers } from 'ethers';

class Cart extends Component {
  constructor(state) {
    super(state);
    this.state = {
      cartItems: [],
      totalCost: ethers.utils.parseEther('0'),
      isCartLoaded: false,
    };
  }

  async componentDidMount() {
    // Check if userAddress and cartContract are defined
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
    console.log("userAddress:", this.state.userAddress);
    console.log("cartContract:", this.state.cartContract);

    if (!this.state.userAddress || !this.state.cartContract) {
      console.error("userAddress or cartContract is not defined.");
      return;
    }

    // Load the user's cart
    await this.loadCart();
  }

  async loadCart() {
    try {
      // Get the number of items in the user's cart
      const itemCount = await this.state.cartContract.getCartItemCount();
      console.log('itemCount:', itemCount.toNumber()); // Log the itemCount
  
      const cartItems = await Promise.all(
        Array.from({ length: itemCount.toNumber() }, async (_, i) => {
          const { itemId, quantity, price, sellerId } = await this.state.cartContract.carts(
            this.state.userAddress,
            i
          );
          console.log('Cart Item:', { itemId, quantity: quantity.toNumber(), price, sellerId }); // Log each cart item
          
          return {
            id: itemId.toNumber(),
            quantity: quantity.toNumber(),
            price: ethers.utils.formatEther(price),
            sellerId,
            productImage: 'https://via.placeholder.com/100?text=Product',
          };
        })
      );
  
      console.log('cartItems:', cartItems); // Log the entire cartItems array
  
      const totalCost = await this.state.cartContract.calculateTotalCost();
      const totalCostString = totalCost.toString(); // Convert BigNumber to string
      this.setState({ cartItems, totalCost: ethers.utils.formatEther(totalCostString), isCartLoaded: true });
      console.log('Total Cost:', totalCostString);
      console.log('Total Cost Type:', typeof totalCostString);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }


  async checkout() {
    try {
      const totalCostWei = ethers.utils.parseEther(this.state.totalCost); // Convert totalCost to Wei
      await this.state.cartContract.checkout({ value: totalCostWei }); // Pass totalCostWei as value
      await this.loadCart();
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  }
  

render() {
  const { cartItems, totalCost, isCartLoaded } = this.state;

  return (
    <div className="Cart">
      <h1>Your Cart</h1>
      {isCartLoaded ? (
        cartItems && cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="Cart-items">
              {cartItems.map((item) => (
                <li key={item.id} className="Cart-item">
                  <div className='cart-item-image-container'>
                    <img
                      className="Cart-item-image"
                      src={'https://via.placeholder.com/100?text=Product'}
                      alt={item.id}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h2 className="cart-item-name">{item.id}</h2>
                    <p className="cart-item-price">Price: Rs.{item.price}</p>
                    <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="cart-total">
              Total: Rs. {totalCost} {/* Use formattedTotalCost */}
            </p>
            <button className="checkout-button" onClick={() => this.checkout()}>Checkout</button>
          </>
        )
      ) : (
        <p>LOADING...</p>
      )}
    </div>
  );
}
}

export default Cart;
