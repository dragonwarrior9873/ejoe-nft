import axios from "axios";
import ContractInstance, { web3 } from "./useContract.ts";
const countNFTsByFilter = async (filterOptions) => {
  console.log(filterOptions);
  try {
    const countFilteredNFT = await ContractInstance.methods
      .countNFTsByFilter(
        filterOptions.includeAuction,
        filterOptions.includeBuyNow
      )
      .call();
    console.log(countFilteredNFT);
    return countFilteredNFT;
  } catch (error) {
    console.log("Error fetching count NFTs by filter:", error);
    return [];
  }
};
const fetchNFTsByFilter = async (filterOptions) => {
  try {
    const filter = {
      category: filterOptions.category || "",
      minPrice: web3.utils.toWei(filterOptions.minPrice.toString(), "ether"),
      maxPrice: web3.utils.toWei(filterOptions.maxPrice.toString(), "ether"),
      includeBuyNow: filterOptions.includeBuyNow || false,
      includeAuction: filterOptions.includeAuction || false,
      sortByPriceLowToHigh: filterOptions.sortByPriceLowToHigh || false,
      sortByPriceHighToLow: filterOptions.sortByPriceHighToLow || false,
      sortByEndingSoon: filterOptions.sortByEndingSoon || false,
      sortByMostFavorited: filterOptions.sortByMostFavorited || false,
      startIndex: filterOptions.startIndex || 0,
      pageSize: filterOptions.pageSize || 10,
    };

    // Call the Solidity function with the filter object
    const filteredNFTs = await ContractInstance.methods
      .getNFTsByFilter(filter)
      .call();

    console.log(filteredNFTs);
    // Check if the response is empty
    if (filteredNFTs.length === 0) {
      console.log("No NFTs found.");
      return [];
    }

    // Handle and process the filtered NFTs
    const NFTsData = await Promise.all(
      filteredNFTs.map(async (nft, index) => {
        // Destructure fields from nft
        const {
          uri,
          creator,
          owner,
          price,
          tokenId,
          isAuction,
          createAt,
          endTime,
          highestBid,
          highestBidder,
          nftBids,
        } = nft;
        console.log(nftBids);
        // Convert price from Wei to Ether
        const priceInEther = web3.utils.fromWei(price.toString(), "ether");

        // Fetch metadata for URI
        const { data } = await getMetadata(uri);
        console.log(data);
        // Create a formatted NFT object for your application
        return {
          NFTid: Number(tokenId),
          isAuction: isAuction || false,
          price: priceInEther,
          Owner: owner,
          createdBy: creator,
          Uri: uri,
          image: `https://cloudflare-ipfs.com/ipfs/${data.image.slice(7)}`,
          name: `${data.name} #${index}`,
          properties: data.properties,
          description: data.description,
          category: data.category,
          createAt: Number(createAt),
          endTime,
          highestBid: web3.utils.fromWei(highestBid.toString(), "ether"),
          highestBidder,
          nftBids,
        };
      })
    );

    // Log the processed NFTs data and return it
    console.log(NFTsData);
    return NFTsData;
  } catch (error) {
    console.log("Error fetching NFTs by filter:", error);
    return [];
  }
};

const getMetadata = async (uri) => {
  console.log(uri);
  return await axios.get(`https://cloudflare-ipfs.com/ipfs/${uri.slice(7)}`);
};
export { fetchNFTsByFilter, countNFTsByFilter };
