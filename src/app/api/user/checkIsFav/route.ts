import { connectToDB } from "@/utils/connectToDB";
import UserModel from "../../../../../model/userModel";
interface RequestBody {
  EthUser: string;
  image: string;
  NFTid: number;
}
interface ResponseData {
  message: string;
  isExist?: boolean;
  status: number;
}
export const POST = async (req: Request): Promise<Response> => {
  try {
    const { EthUser, image, NFTid }: RequestBody = await req.json();
    console.log(EthUser);
    console.log(image);
    console.log(NFTid);

    // Connect to the database
    await connectToDB();

    const isNftExist = await UserModel.findOne({
      userEthAddress: { $regex: new RegExp(`^${EthUser}$`, "i") },
    });
    console.log(isNftExist);

    if (isNftExist) {
      const { FavoriteNFTs, FavoriteAuctionNfts } = isNftExist;
      const isFav =
        FavoriteNFTs.some((nft: any) => {
          console.log(nft);
          return nft.image === image && nft.NFTid === NFTid;
        }) ||
        FavoriteAuctionNfts.some((nft: any) => {
          console.log(nft);
          return nft.image === image && nft.NFTid === NFTid;
        });
      console.log(isFav);

      if (isFav || Object.keys(isFav).length > 0) {
        const responseData: ResponseData = {
          message: "NFT exists 👍",
          isExist: true,
          status: 200,
        };
        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        const responseData: ResponseData = {
          message: "NFT not exists 👍",
          isExist: false,
          status: 200,
        };
        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      // Handle case where user is not found
      const responseData: ResponseData = {
        message: "User not found",
        status: 404,
      };
      return new Response(JSON.stringify(responseData), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in checkIsFav:", error);
    const responseData = {
      error: "Failed to fetch user data",
    };
    return new Response(JSON.stringify(responseData), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
