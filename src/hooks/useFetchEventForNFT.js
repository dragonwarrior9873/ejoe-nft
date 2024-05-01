import ContractInstance from "./useContract";
import { web3 } from "./useContract";

const NFTsActivityEvent = async (_NFTId, _filter) => {
  const ConvertCodeText = (Code) => {
    if (Code == 98) {
      return "mint";
    } else if (Code == 76) {
      return "sell";
    } else if (Code == 77) {
      return "bid";
    }
  };

  try {
    const Response = await ContractInstance.getPastEvents("NFTsActivity", {
      filter: {
        tokenId: _NFTId,
        ...(_filter === "all" ? {} : { action: Number(_filter) }),
      },
      fromBlock: 0,
      toBlock: "latest",
    });
    const Response1 = await ContractInstance.getPastEvents("BidPlaced", {
      filter: {
        tokenId: _NFTId,
        ...(_filter === "all" ? {} : { action: Number(_filter) }),
      },
      fromBlock: 0,
      toBlock: "latest",
    });
    console.log(Response1);

    console.log(Response);
    const NFTsActivityData = Response.map((item) => {
      console.log(item);
      return {
        NFTid: item.returnValues.tokenId,
        action: ConvertCodeText(item.returnValues.action.toString()),
        from: item.returnValues.from,
        to: item.returnValues.to,
        price: web3.utils.fromWei(parseInt(item.returnValues.price), "ether"),
        time: parseInt(item.returnValues.time),
        transactionHash: item.transactionHash,
      };
    });
    return NFTsActivityData;
  } catch (error) {
    console.log(error + " Error in NFTsActivityEvent");
    return null;
  }
};

export { NFTsActivityEvent };
