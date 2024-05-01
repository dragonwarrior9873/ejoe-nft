import ContractInstance from "./useContract";
const ClaimNft = async (tokenId, EthAddress) => {
  try {
    const response = await ContractInstance.methods
      .claimAuctionNFT(tokenId)
      .send({
        from: EthAddress,
        // gas: 500000,
      });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);

    return null;
  }
};

export { ClaimNft };
