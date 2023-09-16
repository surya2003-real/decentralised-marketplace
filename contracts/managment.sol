// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserManagement {
    struct User {
        string username;
        address wallet;
        // Add more user-related fields
    }

    mapping(address => User) public users;
    mapping(string => address) private usernameToAddress;

    event UserRegistered(address indexed userAddress, string username);

    function registerUser(string memory username) public {
        require(usernameToAddress[username] == address(0), "Username is already taken");
        require(bytes(username).length > 0, "Username cannot be empty");

        users[msg.sender] = User(username, msg.sender);
        usernameToAddress[username] = msg.sender;

        emit UserRegistered(msg.sender, username);
    }

    // Function to check if a username is taken
    function isUsernameTaken(string memory username) public view returns (bool) {
        return usernameToAddress[username] != address(0);
    }

    // Function to retrieve the username for an address
    function getUsername(address userAddress) public view returns (string memory) {
        return users[userAddress].username;
    }

    // Function to authenticate a user based on their username and address
    function authenticateUser(string memory username, address userAddress) public view returns (bool) {
        return users[userAddress].wallet == userAddress && keccak256(abi.encodePacked(users[userAddress].username)) == keccak256(abi.encodePacked(username));
    }
}

