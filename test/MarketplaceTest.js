const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace", function () {
  let Marketplace;
  let marketplace;
  let owner;
  let buyer;
  let seller;

  beforeEach(async function () {
    [owner, buyer, seller] = await ethers.getSigners();

    Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.deployed();
  });

  it("Should create a product", async function () {
    const productCountBefore = await marketplace.productCount();
    await marketplace.connect(seller).createProduct("Product 1", "Description", ethers.utils.parseEther("1"));
    const productCountAfter = await marketplace.productCount();

    expect(productCountAfter).to.equal(productCountBefore.add(1));
  });

  it("Should purchase a product", async function () {
    await marketplace.connect(seller).createProduct("Product 1", "Description", ethers.utils.parseEther("1"));
    const product = await marketplace.products(1);
    const initialSellerBalance = await seller.getBalance();

    await marketplace.connect(buyer).purchaseProduct(1, { value: product.price });

    const updatedProduct = await marketplace.products(1);
    const finalSellerBalance = await seller.getBalance();

    expect(updatedProduct.isSold).to.be.true;
    expect(finalSellerBalance).to.equal(initialSellerBalance.add(product.price));
  });
});
