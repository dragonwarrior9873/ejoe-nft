import { connectToDB } from "@/utils/connectToDB";
import UserModel from "../../../../model/userModel";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
// import UserModel from "@/model/userModel";

// Define the structure of the request body
interface RequestBody {
  EthUser: string;
}

// Define the structure of the response object
interface ResponseData {
  message: string;
  result?: any; // The result can be any type
  status: number;
}
export const POST = async (req: Request): Promise<Response> => {
  try {
    let { EthUser }: RequestBody = await req.json();
    EthUser = EthUser?.toLowerCase();
    if (EthUser && EthUser !== "0x0000000000000000000000000000000000000000") {
      await connectToDB();

      // Find existing user with case-insensitive address match
      const existingUser = await UserModel.findOne({
        userEthAddress: { $regex: new RegExp(`^${EthUser}$`, "i") },
      });
      console.log(existingUser);

      if (existingUser) {
        const responseData: ResponseData = {
          message: "Success",
          result: existingUser,
          status: 200,
        };
        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // Create a new user only if no existing user is found
        const newUser = await UserModel.create({
          userEthAddress: EthUser,
        });
        const responseData: ResponseData = {
          message: "Success",
          result: newUser,
          status: 200,
        };
        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
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

export const PUT = async (req: Request): Promise<Response> => {
  try {
    // Connect to the database
    await connectToDB();

    // Parse form data
    const formData = await req.formData();
    const userName = formData.get("userName") as string;
    const emailAddress = formData.get("emailAddress") as string;
    const userBio = formData.get("userBio") as string;
    const website = formData.get("website") as string;
    const x = formData.get("x") as string;
    const telegram = formData.get("telegram") as string;
    const instagram = formData.get("instagram") as string;
    const facebook = formData.get("facebook") as string;
    const EthAddress = formData.get("EthAddress") as string;
    const userProfile = formData.get("userProfile") as File | null;
    console.log(facebook);

    console.log(EthAddress);

    let newUserProfilePath: string | undefined;

    if (userProfile) {
      // Read the file and save it locally
      const buffer = Buffer.from(await userProfile.arrayBuffer());
      const uniqueFilename = `${Date.now()}_${uuidv4()}_${userProfile.name.replace(
        /\s+/g,
        "_"
      )}`;
      const uploadFolderPath = path.join(process.cwd(), "src/app/api/uploads");

      // Create the upload directory if it doesn't exist
      await fs.mkdir(uploadFolderPath, { recursive: true });

      // Save the file to the upload directory
      newUserProfilePath = path.join(uploadFolderPath, uniqueFilename);
      await fs.writeFile(newUserProfilePath, buffer);
    }

    // Get the current user's information to delete the old profile image if necessary

    const currentUser = await UserModel.findOne({
      userEthAddress: { $regex: new RegExp(EthAddress, "i") },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    if (newUserProfilePath && currentUser.userProfile) {
      // Delete the old profile image
      const oldProfilePath = path.join(
        process.cwd(),
        "src/app/api/uploads",
        currentUser.userProfile
      );
      await fs.unlink(oldProfilePath).catch((err) => {
        console.error("Failed to delete old profile image:", err);
      });
    }

    // Update user information in the database
    const updateData: any = {
      userName,
      emailAddress,
      userBio,
      website,
      socialLink: {
        x,
        telegram,
        instagram,
        facebook,
      },
    };

    if (newUserProfilePath) {
      updateData.userProfile = path.basename(newUserProfilePath);
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { userEthAddress: EthAddress },
      updateData,
      { new: true }
    );

    const responseData = {
      message: "Success",
      result: updatedUser,
      status: 200,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating user data:", error);

    const responseData = {
      error: "Failed to update user data",
    };

    return new Response(JSON.stringify(responseData), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
