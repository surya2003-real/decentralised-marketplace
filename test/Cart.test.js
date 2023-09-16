const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Cart contract", function () {
  let Cart;
  let cart;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    Cart = await ethers.getContractFactory("Cart");
    cart = await Cart.deploy();
    await cart.deployed();
  });


  it("should calculate the total cost", async function () {
    const itemId1 = 1;
    const quantity1 = 3;
    const price1 = ethers.utils.parseEther("10.0");

    const itemId2 = 2;
    const quantity2 = 2;
    const price2 = ethers.utils.parseEther("5.0");

    await cart.addItemToCart(itemId1, quantity1, price1, user1.address, user2.address);
    await cart.addItemToCart(itemId2, quantity2, price2, user1.address, user2.address);

    const totalCost = await cart.calculateTotalCost();
    expect(totalCost).to.equal(price1.mul(quantity1).add(price2.mul(quantity2)));
  });

  it("should clear the cart", async function () {
    const itemId = 1;
    const quantity = 3;
    const price = ethers.utils.parseEther("10.0");

    await cart.addItemToCart(itemId, quantity, price, user1.address, user2.address);

    let itemCount = await cart.getCartItemCount();
    expect(itemCount).to.equal(1);

    await cart.clearCart();

    itemCount = await cart.getCartItemCount();
    expect(itemCount).to.equal(0);
  });

});
