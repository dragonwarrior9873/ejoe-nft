const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MarketPlace", function () {
  let nft1, nft2, marketplace, deployer, addr1, addr2;
  const NAME = "Test Name";
  const SYMBOL = "TS";
  const URIS = ["one", "two", "three"];

  beforeEach(async function () {
    //get contract factories
    const NFT = await ethers.getContractFactory("MarketPlace");
    const Marketplace = await ethers.getContractFactory("MarketPlace");

    //get signers
    [deployer, addr1, addr2] = await ethers.getSigners();

    //deploy signers
    nft1 = await NFT.connect(addr1).deploy(URIS, NAME, SYMBOL);
    nft2 = await NFT.connect(addr2).deploy(URIS, NAME, SYMBOL);
    marketplace = await Marketplace.deploy();
  });

  it("Should mint an NFT successfully", async function () {
    // Input parameters for mintNFT
    const tokenURI = "https://example.com/token.json";
    const creatorFee = 2; // 5%
    const priceOfNFT = ethers.utils.parseEther("1"); // 1 ETH
    const approveNFT = true;
    const startAuction = true;
    const startPrice = ethers.utils.parseEther("0.5"); // 0.5 ETH
    const endTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const category = "Art";
    const fileType = "image/png";

    // Call the mintNFT function
    const tx = await marketplace
      .connect(owner)
      .mintNFT(
        tokenURI,
        creatorFee,
        priceOfNFT,
        approveNFT,
        startAuction,
        startPrice,
        endTime,
        category,
        fileType
      );
    await tx.wait();

    // Check that NFT was minted
    const mintedNFTId = (await marketplace.NFTNextId()) - 1;
    const nftDetails = await marketplace.NFTsDetails(mintedNFTId);

    expect(nftDetails.creatorFee).to.equal(creatorFee);
    expect(nftDetails.approveNFT).to.equal(approveNFT);
    expect(nftDetails.isAuction).to.equal(startAuction);
    expect(nftDetails.category).to.equal(category);
    expect(nftDetails.fileType).to.equal(fileType);

    // If startAuction is true, check the auction details
    if (startAuction) {
      const auction = await marketplace.auctions(mintedNFTId);
      expect(auction.seller).to.equal(owner.address);
      expect(auction.startPrice).to.equal(startPrice);
      expect(auction.endTime).to.equal(endTime);
      expect(auction.ended).to.be.false;
    }
  });
});
