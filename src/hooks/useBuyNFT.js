import ContractInstance from "./useContract";

const BuyNFT = async (nftId, EthAddress) => {
  console.log(nftId);
  console.log(EthAddress);
  let PriceOfNFT = await ContractInstance.methods.getPriceOfNFT(nftId).call();
  console.log(PriceOfNFT);
  try {
    const response = await ContractInstance.methods.buyNFT(nftId).send({
      from: EthAddress,
      value: PriceOfNFT,
      // gas: 500000,
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { BuyNFT };
