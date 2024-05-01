import { connectToDB } from "@/utils/connectToDB";
import UserModel from "../../../../../model/userModel";
interface RequestBody {
  EthUser: string;
  NFTData: any;
}
interface ResponseData {
  message: string;
  success?: boolean;
  status: number;
}
export const POST = async (req: Request): Promise<Response> => {
  try {
    const { EthUser, NFTData }: RequestBody = await req.json();

    // Connect to the database
    await connectToDB();
    const isNftExist = await UserModel.findOne({
      userEthAddress: { $regex: new RegExp(`^${EthUser}$`, "i") },
      FavoriteAuctionNfts: NFTData,
    });
    console.log(isNftExist);
    if (isNftExist) {
      const r = await UserModel.updateOne(
        { userEthAddress: { $regex: new RegExp(`^${EthUser}$`, "i") } },
        { $pull: { FavoriteAuctionNfts: NFTData } },
        { upsert: true }
      );
      const responseData: ResponseData = {
        message: "Auction NFT removed from Favorite Section 👍",
        success: true,
        status: 200,
      };
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const result = await UserModel.updateOne(
        { userEthAddress: { $regex: new RegExp(`^${EthUser}$`, "i") } },
        { $addToSet: { FavoriteAuctionNfts: NFTData } },
        { new: true }
      );
      console.log(result);
      const responseData: ResponseData = {
        message: "Auction NFT added in Favorite Section 🎉",
        success: true,
        status: 200,
      };
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in addNFTFavorite:", error);
    const responseData = {
      error: "Internal Server Error",
    };
    return new Response(JSON.stringify(responseData), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
