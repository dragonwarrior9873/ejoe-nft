import { connectToDB } from "@/utils/connectToDB";
import UserModel from "../../../../../model/userModel";

interface ResponseData {
  message: string;
  result?: any;
  status: number;
}

interface ParamsType {
  id: string;
}

export const GET = async (
  req: Request,
  { params }: { params: ParamsType }
): Promise<Response> => {
  try {
    console.log(params);
    const { id } = params;
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type");
    const limitParam = searchParams.get("limit");
    const startIndexParam = searchParams.get("startIndex");

    await connectToDB();

    if (type === "Popular") {
      // Fetch all top creators according to limit and startIndex
      const limit = limitParam ? parseInt(limitParam, 10) : 10;
      const startIndex = startIndexParam ? parseInt(startIndexParam, 10) : 0;

      // Implement your logic to fetch top creators
      // Example:
      const topCreators = await UserModel.find({
        userEthAddress: { $ne: id.toLowerCase() },
      });
      // .limit(limit)
      // .skip(startIndex);

      return new Response(JSON.stringify(topCreators), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (type === "Following") {
      // Fetch creators whom the user can follow based on EthID
      if (id && id !== "0x0000000000000000000000000000000000000000") {
        const result = await UserModel.find({
          userEthAddress: { $regex: new RegExp(id, "i") },
        });
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // Return an appropriate response if EthId is not valid
        const responseData: ResponseData = {
          message: "Invalid EthAddress",
          status: 400,
        };
        return new Response(JSON.stringify(responseData), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      // Handle invalid type parameter
      const responseData: ResponseData = {
        message: "Invalid type parameter",
        status: 400,
      };
      return new Response(JSON.stringify(responseData), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error(error);
    const responseData = {
      error: "Failed to fetch user data",
    };
    return new Response(JSON.stringify(responseData), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
