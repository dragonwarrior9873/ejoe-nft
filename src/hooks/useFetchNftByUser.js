import axios from "axios";
import ContractInstance from "./useContract";
const fetchCreatedNFT = async (_user) => {
  try {
    const CreatedNfts = await ContractInstance.methods
      .getUserCreatedNFTs(_user)
      .call();
    return {
      Created: CreatedNfts,
    };
  } catch (error) {
    console.log(error);
  }
};
const fetchOwnedNFT = async (_user) => {
  try {
    const OwnedNfts = await ContractInstance.methods
      .getUserOwnedNFTs(_user)
      .call();
    return {
      owned: OwnedNfts,
    };
  } catch (error) {
    console.log(error);
  }
};
const fetchCreatedAuctionNFT = async (_user) => {
  try {
    const AuctionNfts = await ContractInstance.methods
      .getUserCreatedAuctionNFTs(_user)
      .call();
    return {
      Auction: AuctionNfts,
    };
  } catch (error) {
    console.log(error);
  }
};
const fetchOwnedAuctionNFT = async (_user) => {
  try {
    const AuctionNfts = await ContractInstance.methods
      .getUserOwnedAuctionNFTs(_user)
      .call();
    return {
      Auction: AuctionNfts,
    };
  } catch (error) {
    console.log(error);
  }
};
export {
  fetchCreatedNFT,
  fetchCreatedAuctionNFT,
  fetchOwnedAuctionNFT,
  fetchOwnedNFT,
};
