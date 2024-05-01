import { connectToDB } from "@/utils/connectToDB";
import UserModel from "../../../../../model/userModel";

interface ResponseData {
  message: string;
  result?: any;
  status: number;
}
interface ParamsType {
  EthID: string;
}
export const GET = async (
  req: Request,
  { params }: { params: ParamsType }
): Promise<Response> => {
  try {
    console.log(params);
    const { EthID } = params;
    await connectToDB();
    if (EthID && EthID !== "0x0000000000000000000000000000000000000000") {
      const result = await UserModel.findOne({
        // userEthAddress: { $regex: new RegExp(EthID, "i") },
        userEthAddress: EthID.toLowerCase(),
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
