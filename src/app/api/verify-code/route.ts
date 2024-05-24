import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { decode } from "punycode";

export async function POST(request: Request) {
  //connect db
  await dbConnect();

  try {
    // fetch form frontend 
   const {username, code} =  await request.json()

   const decodedUsername = decodeURIComponent(username)

   const user = await UserModel.findOne({username: decodedUsername})

   if(!user){
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

  const isCodeValid =  user?.verifyCode ===  code 
  const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

  if(isCodeValid && isCodeNotExpired){
    user.isVerified =  true
    await user.save()

    return Response.json(
        {
          success: true,
          message: "Account verifed successfully",
        },
        {
          status: 200,
        }
      );
  }else if(!isCodeNotExpired){
    return Response.json(
        {
          success: false,
          message: "verification Code has expired, please signup again to get a new code",
        },
        {
          status: 400,
        }
      );
  }else{
    return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        {
          status: 400,
        }
      );
  }



  } catch (error) {
    console.log("Error verifing user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
