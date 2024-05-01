import { web3 } from "@/hooks/useContract";
import axios from "axios";

const getMetadata = async (uri) => {
  try {
    if (uri) {
      const response = await axios.get(
        `https://cloudflare-ipfs.com/ipfs/${uri}`
      );
      return response.data;
    }
  } catch (error) {
    console.error(error);
  }
};
export const mapArray = async (item) => {
  const metaDataObject = await getMetadata(item.uri.slice(7));
  if (metaDataObject) {
    return {
      price: web3.utils.fromWei(item.price.toString(), "ether"),
      NFTid: parseInt(item.tokenId),
      isAuction: item?.isAuction,
      Owner: item?.owner,
      name: `${metaDataObject.name} #${item.tokenId}`,
      description: metaDataObject.description,
      properties: metaDataObject.properties,
      createdBy: item.creator,
      category: metaDataObject?.category,
      createAt: Number(item?.createAt),
      image: `https://cloudflare-ipfs.com/ipfs/${metaDataObject.image.slice(
        7
      )}`,
      fileType: item?.fileType,
      endTime: item?.endTime,
      highestBid: item?.highestBid,
      highestBidder: item?.highestBidder,
    };
  }
};
