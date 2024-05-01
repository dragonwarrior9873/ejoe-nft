import { connectToDB } from "@/utils/connectToDB";
import NotificationModel from "../../../../model/notificationModel";
interface RequestBody {
  description: string;
  sender: string;
  receiver: string;
  href: string;
}
interface ResponseData {
  message: string;
  result?: any;
  status: number;
}
export const POST = async (req: Request): Promise<Response> => {
  try {
    let { description, sender, receiver, href }: RequestBody = await req.json();
    await connectToDB();
    const createNoti = await NotificationModel.create({
      description,
      sender,
      receiver,
      href,
    });

    const responseData: ResponseData = {
      message: "Success",
      result: createNoti,
      status: 200,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    const responseData = {
      error: "Failed to create notification",
    };
    return new Response(JSON.stringify(responseData), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
