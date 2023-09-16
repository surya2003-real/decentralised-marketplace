contract ReviewSystem {
    struct Review {
        uint256 itemId;
        address reviewer;
        uint8 rating; // You can use a rating scale, e.g., 1-5 stars
        string comment;
    }

    mapping(uint256 => Review[]) public itemReviews;

    event ReviewAdded(uint256 indexed itemId, address indexed reviewer, uint8 rating, string comment);

    function addReview(uint256 itemId, uint8 rating, string memory comment) public {
        require(rating >= 1 && rating <= 5, "Invalid rating value");

        itemReviews[itemId].push(Review(itemId, msg.sender, rating, comment));
        emit ReviewAdded(itemId, msg.sender, rating, comment);
    }

    // Add functions to retrieve reviews for items
    // the ether.js part 
}
