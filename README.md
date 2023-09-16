# Decentralized Marketplace
![image](./images/dappathon2(2).jpg)
## Getting started
Clone the repo on your computer and follow the instructions below to run the dapp.
```
cd frontend
```
```
cd marketplace
```
```
npm install
```
```
npm start
```
## Marketplace Smart Contract Documentation

### Table of Contents

- [Introduction](#introduction)
- [Contract Details](#contract-details)
- [Modifiers](#modifiers)
- [Functions](#functions)
  - [constructor](#constructor)
  - [onlyOwner](#onlyowner)
  - [registerProduct](#registerproduct)
  - [purchaseProduct](#purchaseproduct)
  - [listProduct](#listproduct)
- [Structs](#structs)
  - [Product](#product)
- [Events](#events)
  - [ProductCreated](#productcreated)
  - [ProductPurchased](#productpurchased)

### Introduction

The `Marketplace` contract is a simple smart contract that facilitates the management of products in a marketplace. It allows the owner of the contract to register new products, buyers to purchase products, and sellers to list previously sold products.

### Contract Details

- **Owner:** The owner of the contract is the deployer's address.
- **Product Count:** Tracks the total number of registered products.

### Modifiers

#### `onlyOwner`

- Ensures that a function can only be called by the owner of the contract.

### Functions

#### `constructor`

- **Description:** Initializes the contract with the deployer's address as the owner.

#### `onlyOwner`

- **Description:** Modifier to restrict access to the contract owner.

#### `registerProduct`

- **Description:** Registers a new product in the marketplace.
- **Parameters:**
  - `_name` (string): The name of the product.
  - `_description` (string): The description of the product.
  - `_price` (uint256): The price of the product.
  - `_quantity` (uint256): The quantity of the product available for sale.

#### `purchaseProduct`

- **Description:** Purchases a product from the marketplace.
- **Parameters:**
  - `_productId` (uint256): The ID of the product to purchase.
  - `_quantity` (uint256): The quantity of the product to purchase.

#### `listProduct`

- **Description:** Lists a previously sold product in the marketplace.
- **Parameters:**
  - `_productId` (uint256): The ID of the product to list.

### Structs

#### `Product`

- **Description:** Represents a product available in the marketplace.
- **Fields:**
  - `id` (uint256): The unique identifier of the product.
  - `name` (string): The name of the product.
  - `description` (string): The description of the product.
  - `price` (uint256): The price of the product.
  - `quantity` (uint256): The quantity of the product available for sale.
  - `seller` (address payable): The address of the seller.
  - `buyer` (address payable): The address of the buyer (if sold).
  - `isSold` (bool): Indicates whether the product is sold.

### Events

#### `ProductCreated`

- **Description:** Emitted when a new product is registered in the marketplace.
- **Parameters:**
  - `id` (uint256): The ID of the created product.
  - `name` (string): The name of the product.
  - `price` (uint256): The price of the product.
  - `quantity` (uint256): The quantity of the product available for sale.
  - `seller` (address): The address of the seller.

#### `ProductPurchased`

- **Description:** Emitted when a product is purchased from the marketplace.
- **Parameters:**
  - `id` (uint256): The ID of the purchased product.
  - `name` (string): The name of the product.
  - `price` (uint256): The price of the product.
  - `quantity` (uint256): The quantity of the product purchased.
  - `buyer` (address): The address of the buyer.

## Cart Smart Contract Documentation

### Table of Contents

- [Introduction](#introduction)
- [Structs](#structs)
  - [CartItem](#cartitem)
- [Events](#events)
  - [ItemAddedToCart](#itemaddedtocart)
  - [CheckoutCompleted](#checkoutcompleted)
- [Functions](#functions)
  - [addItemToCart](#additemtocart)
  - [getCartItemCount](#getcartitemcount)
  - [clearCart](#clearcart)
  - [checkout](#checkout)
  - [calculateTotalCost](#calculatetotalcost)

### Introduction

The `Cart` contract is designed to manage a user's shopping cart. It allows users to add items to their cart, check out, and calculate the total cost of the items in the cart.

### Structs

#### `CartItem`

- **Description:** Represents an item in the shopping cart.
- **Fields:**
  - `itemId` (uint256): The unique identifier of the item.
  - `quantity` (uint256): The quantity of the item.
  - `price` (uint256): The price of the item.
  - `buyerId` (address): The address of the buyer.
  - `sellerId` (address): The address of the seller.

### Events

#### `ItemAddedToCart`

- **Description:** Emitted when an item is added to the shopping cart.
- **Parameters:**
  - `user` (address): The address of the user adding the item.
  - `itemId` (uint256): The ID of the added item.
  - `quantity` (uint256): The quantity of the added item.
  - `price` (uint256): The price of the added item.
  - `buyerId` (address): The address of the buyer.
  - `sellerId` (address): The address of the seller.

#### `CheckoutCompleted`

- **Description:** Emitted when the user completes the checkout process.
- **Parameters:**
  - `user` (address): The address of the user who completed the checkout.
  - `totalCost` (uint256): The total cost of the items in the cart.

### Functions

#### `addItemToCart`

- **Description:** Adds an item to the shopping cart.
- **Parameters:**
  - `itemId` (uint256): The ID of the item to add.
  - `quantity` (uint256): The quantity of the item to add.
  - `price` (uint256): The price of the item to add.
  - `buyerId` (address): The address of the buyer.
  - `sellerId` (address): The address of the seller.

#### `getCartItemCount`

- **Description:** Retrieves the number of items in the user's shopping cart.
- **Returns:** (uint256) The number of items in the cart.

#### `clearCart`

- **Description:** Clears the user's shopping cart, removing all items.

#### `checkout`

- **Description:** Completes the checkout process, transferring funds to sellers and clearing the cart.
- **Modifiers:** Requires the user to send sufficient funds to cover the total cost.
- **Emits:** `CheckoutCompleted` event.

#### `calculateTotalCost`

- **Description:** Calculates the total cost of the items in the user's cart.
- **Returns:** (uint256) The total cost of the items in the cart.
