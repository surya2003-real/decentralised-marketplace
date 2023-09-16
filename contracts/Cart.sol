// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Cart {
    struct CartItem {
        uint256 itemId;
        uint256 quantity;
        uint256 price;
        address buyerId;
        address sellerId;
    }

    mapping(address => CartItem[]) public carts;

    event ItemAddedToCart(
        address indexed user,
        uint256 indexed itemId,
        uint256 quantity,
        uint256 price,
        address buyerId,
        address sellerId
    );

    event CheckoutCompleted(address indexed user, uint256 totalCost);

    function addItemToCart(
        uint256 itemId,
        uint256 quantity,
        uint256 price,
        address buyerId,
        address sellerId
    ) public {
        require(quantity > 0, "Quantity must be greater than zero");
        require(price > 0, "Price must be greater than zero");

        CartItem memory newItem = CartItem(itemId, quantity, price, buyerId, sellerId);
        carts[msg.sender].push(newItem);

        emit ItemAddedToCart(msg.sender, itemId, quantity, price, buyerId, sellerId);
    }

    function getCartItemCount() public view returns (uint256) {
        return carts[msg.sender].length;
    }

    function clearCart() public {
        delete carts[msg.sender];
    }

    function checkout() public payable {
        uint256 totalCost = calculateTotalCost();
        require(msg.value >= totalCost, "Insufficient funds");

        for (uint256 i = 0; i < carts[msg.sender].length; i++) {
            address payable seller = payable(carts[msg.sender][i].sellerId);
            uint256 itemCost = carts[msg.sender][i].quantity * carts[msg.sender][i].price;
            seller.transfer(itemCost);
        }

        emit CheckoutCompleted(msg.sender, totalCost);
        clearCart();
    }

    function calculateTotalCost() public view returns (uint256) {
        uint256 totalCost;
        for (uint256 i = 0; i < carts[msg.sender].length; i++) {
            totalCost += carts[msg.sender][i].quantity * carts[msg.sender][i].price;
        }
        return totalCost;
    }
}
