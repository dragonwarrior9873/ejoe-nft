import ContractInstance from "./useContract";
import { web3 } from "./useContract";
import axios from "axios";

// Define a type for the expected NFT response from the contract
interface NFTContractResponse {
  isAuction: boolean;
  uri: string;
  price: string;
}

// Define a type for the expected response when fetching NFT details
interface NFTDetailsResponse {
  startPrice?: string;
  endTime?: number;
  createAt: number;
  creatorFees: string;
  isListed: boolean;
  owner: string;
  creator: string;
  highestBid?: string;
  highestBidder?: string;
  ended?: boolean;
  nftBids: any;
}

// Define a type for the metadata response
interface Metadata {
  data: {
    image: string;
    name: string;
    properties: object;
    description: string;
    category: string;
  };
}

// Define a type for the NFT response
interface NFTResponse {
  NFTId: number;
  Price: string;
  startPrice?: string;
  auctionEnded?: number;
  CreateAt: number;
  creatorFees: string;
  IsListed: boolean;
  CurrentOwner: string;
  Image: string;
  Name: string;
  Properties: object;
  Description: string;
  Creator: string;
  Category: string;
  highestBid?: string;
  highestBidder?: string;
  ended?: boolean;
  isAuction: boolean;
  nftBids: any;
}

// Type for getMetadata function
const getMetadata = async (uri: string): Promise<Metadata> => {
  return axios.get(`https://cloudflare-ipfs.com/ipfs/${uri.slice(7)}`);
};

// Type for fetchNFTById function
const fetchNFTById = async (NftId: number): Promise<NFTResponse | null> => {
  try {
    // Fetch NFT response using ContractInstance
    const response: NFTContractResponse = await ContractInstance.methods
      .getNFTById(NftId)
      .call();

    if (!response) {
      throw new Error("Failed to fetch NFT data");
    }

    const { isAuction, uri, price } = response;

    // Fetch additional details based on auction status
    const response_2: NFTDetailsResponse = isAuction
      ? await ContractInstance.methods.getNFTAndAuctionDetails(NftId).call()
      : await ContractInstance.methods.NFTsDetails(NftId).call();
    console.log(response_2);
    if (!response_2) {
      throw new Error("Failed to fetch NFT details");
    }

    // Fetch metadata
    const metadataJson = (await getMetadata(uri)).data;

    if (!metadataJson) {
      throw new Error("Failed to fetch metadata");
    }

    // Return NFT response object
    return {
      NFTId: NftId,
      Price: web3.utils.fromWei(price.toString(), "ether"),
      startPrice: isAuction
        ? web3.utils.fromWei(response_2.startPrice?.toString(), "ether")
        : undefined,
      auctionEnded: isAuction ? response_2.endTime : undefined,
      CreateAt: Number(response_2.createAt),
      creatorFees: response_2.creatorFees,
      IsListed: response_2.isListed,
      CurrentOwner: response_2.owner,
      Image: `https://cloudflare-ipfs.com/ipfs/${metadataJson.image.slice(7)}`,
      Name: `${metadataJson.name} #${NftId}`,
      Properties: metadataJson.properties,
      Description: metadataJson.description,
      Creator: response_2.creator,
      Category: metadataJson.category,
      highestBid: isAuction
        ? web3.utils.fromWei(response_2.highestBid?.toString(), "ether")
        : undefined,
      highestBidder: isAuction ? response_2.highestBidder : undefined,
      ended: isAuction ? response_2.ended : undefined,
      isAuction: isAuction,
      nftBids: response_2?.nftBids?.reverse(),
    };
  } catch (error) {
    console.error("Error fetching NFT by ID:", error);
    return null;
  }
};

export { fetchNFTById };
