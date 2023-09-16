// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OrderManagement is Ownable {
    using Counters for Counters.Counter;

    enum OrderStatus { Placed, Shipped, Delivered, Cancelled }

    struct Order {
        uint256 orderId;
        uint256 itemId;
        address buyer;
        address seller;
        uint256 totalPrice;
        OrderStatus status;
    }

    Counters.Counter private _orderIds;
    mapping(uint256 => Order) public orders;

    event OrderPlaced(uint256 indexed orderId, address indexed buyer, address indexed seller, uint256 itemId, uint256 totalPrice);

    function placeOrder(uint256 itemId, address seller) public payable {
        require(msg.value > 0, "Payment must be included");
        require(seller != address(0), "Invalid seller address");

        _orderIds.increment();
        uint256 newOrderId = _orderIds.current();
        uint256 totalPrice = msg.value;

        orders[newOrderId] = Order(newOrderId, itemId, msg.sender, seller, totalPrice, OrderStatus.Placed);

        emit OrderPlaced(newOrderId, msg.sender, seller, itemId, totalPrice);
    }

    // Add functions for order status updates, order retrieval, and cancellation
    // For example:
    
    function updateOrderStatus(uint256 orderId, OrderStatus newStatus) public onlyOwner {
        require(orders[orderId].orderId != 0, "Order does not exist");
        orders[orderId].status = newStatus;
    }

    function getOrder(uint256 orderId) public view returns (Order memory) {
        return orders[orderId];
    }

    function cancelOrder(uint256 orderId) public onlyOwner {
        require(orders[orderId].orderId != 0, "Order does not exist");
        require(orders[orderId].status == OrderStatus.Placed, "Order cannot be cancelled");
        
        // Refund the buyer
        payable(orders[orderId].buyer).transfer(orders[orderId].totalPrice);
        
        // Update order status to Cancelled
        orders[orderId].status = OrderStatus.Cancelled;
    }
}
