// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract Marketplace {
    using Counters for Counters.Counter;

    address public owner;
    uint256 public productCount;

    struct Product {
        uint256 id;
        string name;
        string description;
        uint256 price;
        uint256 quantity; // Add quantity
        address payable seller;
        address payable buyer;
        bool isSold;
    }

    mapping(uint256 => Product) public products;

    event ProductCreated(uint256 id, string name, uint256 price, uint256 quantity, address seller);
    event ProductPurchased(uint256 id, string name, uint256 price, uint256 quantity, address buyer);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function registerProduct(string memory _name, string memory _description, uint256 _price, uint256 _quantity) public onlyOwner {
        require(bytes(_name).length > 0, "Product name cannot be empty");
        require(bytes(_description).length > 0, "Product description cannot be empty");
        require(_price > 0, "Product price must be greater than 0");
        require(_quantity > 0, "Product quantity must be greater than 0");

        productCount++;
        products[productCount] = Product(productCount, _name, _description, _price, _quantity, payable(msg.sender), payable(address(0)), false);
        emit ProductCreated(productCount, _name, _price, _quantity, msg.sender);
    }

    function purchaseProduct(uint256 _productId, uint256 _quantity) public {
        Product storage product = products[_productId];
        require(product.id > 0 && !product.isSold, "Product does not exist or is already sold");
        require(_quantity <= product.quantity, "Not enough quantity available");

        product.quantity -= _quantity; // Update the remaining quantity
        emit ProductPurchased(product.id, product.name, product.price, _quantity, msg.sender);
    }

    function listProduct(uint256 _productId) public {
        Product storage product = products[_productId];
        require(product.id > 0 && product.isSold, "Product does not exist or is not sold");
        require(msg.sender == product.seller, "Only the seller can list the product");

        product.isSold = false;
        product.buyer = payable(address(0));
    }
}
