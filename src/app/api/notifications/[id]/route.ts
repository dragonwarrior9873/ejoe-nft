import NotificationModel from "../../../../../model/notificationModel";
import { connectToDB } from "@/utils/connectToDB";
import UserModel from "../../../../../model/userModel";

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
interface ParamsType {
  id: string;
}
export const GET = async (
  req: Request,
  { params }: { params: ParamsType }
): Promise<Response> => {
  try {
    await connectToDB();

    const { id } = params;
    const result = await NotificationModel.find({ receiver: id })
      .populate("sender", "", UserModel)
      .populate("receiver", "", UserModel);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    const responseData = {
      error: "Failed to fetch notification data",
    };
    return new Response(JSON.stringify(responseData), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
export const PUT = async (
  req: Request,
  { params }: { params: ParamsType }
): Promise<Response> => {
  try {
    await connectToDB();

    const { id } = params;

    const updatedNotification = await NotificationModel.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true }
    );

    if (!updatedNotification) {
      return new Response(JSON.stringify({ error: "Notification not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const responseData: ResponseData = {
      message: "Notification updated successfully",
      result: updatedNotification,
      status: 200,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    const responseData = {
      error: "Failed to update notification status",
    };
    return new Response(JSON.stringify(responseData), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
