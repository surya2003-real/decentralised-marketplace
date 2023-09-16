// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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

    // Function to get the number of reviews for an item
    function getReviewCount(uint256 itemId) public view returns (uint256) {
        return itemReviews[itemId].length;
    }

    // Function to get a specific review for an item by index
    function getReview(uint256 itemId, uint256 index) public view returns (uint8 rating, string memory comment) {
        require(index < itemReviews[itemId].length, "Review index out of bounds");
        Review memory review = itemReviews[itemId][index];
        return (review.rating, review.comment);
    }
}
