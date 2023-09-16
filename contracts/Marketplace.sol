// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    address public owner;
    uint256 public productCount;

    struct Product {
        uint256 id;
        string name;
        string description;
        uint256 price;
        address payable seller;
        address payable buyer;
        bool isSold;
    }

    mapping(uint256 => Product) public products;

    event ProductCreated(uint256 id, string name, uint256 price, address seller);
    event ProductPurchased(uint256 id, string name, uint256 price, address buyer);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function createProduct(string memory _name, string memory _description, uint256 _price) public {
        require(bytes(_name).length > 0, "Product name cannot be empty");
        require(bytes(_description).length > 0, "Product description cannot be empty");
        require(_price > 0, "Product price must be greater than 0");

        productCount++;
        products[productCount] = Product(productCount, _name, _description, _price, payable(msg.sender), payable(address(0)), false);
        emit ProductCreated(productCount, _name, _price, msg.sender);
    }

    function purchaseProduct(uint256 _productId) public payable {
        Product storage product = products[_productId];
        require(product.id > 0 && !product.isSold, "Product does not exist or is already sold");
        require(msg.value >= product.price, "Insufficient funds to purchase the product");

        product.buyer = payable(msg.sender);
        product.seller.transfer(msg.value);
        product.isSold = true;
        emit ProductPurchased(product.id, product.name, product.price, msg.sender);
    }

    function withdrawBalance() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function listProduct(uint256 _productId) public {
        Product storage product = products[_productId];
        require(product.id > 0 && product.isSold, "Product does not exist or is not sold");
        require(msg.sender == product.seller, "Only the seller can list the product");

        product.isSold = false;
        product.buyer = payable(address(0));
    }
}
