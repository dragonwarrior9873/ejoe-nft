import ContractInstance, { web3 } from "./useContract.ts";
const countNFTsByCategory = async (categories) => {
  console.log(categories);
  try {
    const countCategoriesNFT = await ContractInstance.methods
      .countNFTsByCategory(categories)
      .call();
    console.log(countCategoriesNFT);
    return countCategoriesNFT;
  } catch (error) {
    console.log("Error fetching count category nft by filter:", error);
    return [];
  }
};
export { countNFTsByCategory };
