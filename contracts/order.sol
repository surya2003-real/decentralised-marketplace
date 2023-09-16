contract OrderManagement {
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
    // the ether.js updates the data from the cloud base
}
