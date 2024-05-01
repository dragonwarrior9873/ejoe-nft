import ContractInstance from "./useContract";
import { web3 } from "./useContract";
import { ethereumUsd } from "./useEtherUsdPrice";

const PlaceBid = async (EthAddress, tokenId, bidPrice, username, image) => {
  console.log(tokenId);
  const ether = Number(bidPrice / (await ethereumUsd())).toFixed(18);
  const _wei = web3.utils.toWei(ether, "ether");
  try {
    const response = await ContractInstance.methods
      .placeBid(tokenId, image, username)
      .send({
        from: EthAddress,
        value: _wei,
        //   gas: 500000,
      });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const getBidsByNFT = async (tokenId) => {
  console.log(tokenId);
  try {
    const response = await ContractInstance.methods.getBidsForNFT(tokenId);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export { getBidsByNFT, PlaceBid };
