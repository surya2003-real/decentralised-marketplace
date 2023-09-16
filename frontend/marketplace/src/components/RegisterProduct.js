import React, { Component } from 'react';
import { ethers } from 'ethers';
import './RegisterProduct.css';
class RegisterProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            price: '',
            quantity: '', // Add a quantity field
            provider: null,
            marketplaceContract: null,
        };
    }

    async componentDidMount() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            this.setState({ provider });
    
            const signer = provider.getSigner(); // Get the signer for transaction operations
    
            const abi = [{"type":"constructor","stateMutability":"nonpayable"},{"name":"ProductCreated","inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"quantity","type":"uint256"},{"indexed":false,"internalType":"address","name":"seller","type":"address"}],"type":"event"},{"name":"ProductPurchased","inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"quantity","type":"uint256"},{"indexed":false,"internalType":"address","name":"buyer","type":"address"}],"type":"event"},{"name":"listProduct","inputs":[{"internalType":"uint256","name":"_productId","type":"uint256"}],"type":"function","stateMutability":"nonpayable"},{"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"type":"function","stateMutability":"view"},{"name":"productCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"type":"function","stateMutability":"view"},{"name":"products","inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"address payable","name":"seller","type":"address"},{"internalType":"address payable","name":"buyer","type":"address"},{"internalType":"bool","name":"isSold","type":"bool"}],"type":"function","stateMutability":"view"},{"name":"purchaseProduct","inputs":[{"internalType":"uint256","name":"_productId","type":"uint256"},{"internalType":"uint256","name":"_quantity","type":"uint256"}],"type":"function","stateMutability":"nonpayable"},
            {"name":"registerProduct","inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_quantity","type":"uint256"}],"type":"function","stateMutability":"nonpayable"}];
            const marketplaceContractAddress = "0x6537535d034102d714f9263698DEB6BEbc99254B";
            const marketplaceContract = new ethers.Contract(
                marketplaceContractAddress,
                abi,
                signer // Use the signer for contract interactions
            );
    
            // Ensure that the contract is initialized before setting it in state
            await marketplaceContract.deployed();
    
            this.setState({ marketplaceContract, signer }); // Store the signer in the state
        } catch (error) {
            console.error('Error connecting to Ethereum or initializing contract:', error);
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { name, description, price, quantity, marketplaceContract } = this.state;

        try {
            const priceInWei = ethers.utils.parseEther(price);
            const quantityAsNumber = parseInt(quantity, 10);

            const tx = await marketplaceContract.registerProduct(name, description, priceInWei, quantityAsNumber);
            
            await tx.wait();
            
            this.setState({ name: '', description: '', price: '', quantity: '' });
            
            if (this.props.onProductRegistered) {
                this.props.onProductRegistered();
            }
        } catch (error) {
            console.error('Error registering product:', error);
        }
    }

    // Add a helper function to check if the contract is ready
    isContractReady = () => {
        return this.state.marketplaceContract !== null;
    }

    render() {
        const { name, description, price, quantity } = this.state;

        return (
            <div className='RegisterProduct'>
                <h2>Register a Product</h2>
                {this.isContractReady() ? (
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                        <label>
                            Name:
                            <input type="text" name="name" value={name} onChange={this.handleChange} required />
                        </label>
                        </div>
                        <div className="form-group">
                        <label>
                            Description:
                            <textarea name="description" value={description} onChange={this.handleChange} required />
                        </label>
                        </div>
                        <div className="form-group">
                        <label>
                            Price (ETH):
                            <input type="number" step="0.01" name="price" value={price} onChange={this.handleChange} required />
                        </label>
                        </div>
                        <div className="form-group">
                        <label>
                            Quantity:
                            <input type="number" name="quantity" value={quantity} onChange={this.handleChange} required />
                        </label>
                        </div>
                        <div className="form-group">
                        <button type="submit">Register</button>
                        </div>
                    </form>
                ) : (
                    <p>Initializing contract...</p>
                )}
            </div>
        );
    }
}

export default RegisterProduct;
