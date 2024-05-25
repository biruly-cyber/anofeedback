import { getServerSession } from "next-auth";
import { authOtions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  //get information from session
  const session = await getServerSession(authOtions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user._id;

  //   request come from frontend
  const { acceptMessages } = await request.json();

  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );

    if (!updateUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept message",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updateUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to update user status to accept message");
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept message",
      },
      {
        status: 500,
      }
    );
  }
}

//get request

export async function GET(request: Request) {
    await dbConnect()
  //get information from session
  const session = await getServerSession(authOtions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error is getting message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}
