const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace contract", function () {
  let Marketplace;
  let marketplace;
  let owner;
  let buyer;
  let product;

  beforeEach(async function () {
    [owner, buyer] = await ethers.getSigners();

    Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.deployed();
  });

  it("should register a product", async function () {
    const productName = "Sample Product";
    const productDescription = "Description of the sample product";
    const productPrice = ethers.utils.parseEther("1.0");
    const productQuantity = 10;

    await marketplace.registerProduct(productName, productDescription, productPrice, productQuantity);

    const productData = await marketplace.products(1);
    expect(productData.id).to.equal(1);
    expect(productData.name).to.equal(productName);
    expect(productData.description).to.equal(productDescription);
    expect(productData.price).to.equal(productPrice);
    expect(productData.quantity).to.equal(productQuantity);
    expect(productData.seller).to.equal(owner.address);
    expect(productData.buyer).to.equal("0x0000000000000000000000000000000000000000");
    expect(productData.isSold).to.equal(false);
  });

});
