import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request:Request) {
    await dbConnect();
    const session = await getServerSession(nextAuthOptions)
    const user:User = session?.user as User
    if(!session || !user){
        return Response.json(
            {
              success: false,
              message: "Not Authenticated",
            },
            { status: 401 }
          );
    }
    const userId = user._id;
    const {toggleAcceptingMessage} = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessage:toggleAcceptingMessage
        },{new:true})
        if(!updatedUser){
            return Response.json(
                {
                  success: false,
                  message: "unable to update user to accept message",
                },
                { status: 401}
              );
        }
        return Response.json(
            {
              success: true,
              message: "successfully toggled message acceptance status",
              updatedUser
            },
            { status: 200 }
          );
    } catch (error) {
        console.log("Failed to update user status to accept message")
        return Response.json(
            {
              success: false,
              message: "Failed to update user status to accept message",
            },
            { status: 500 }
          );
    }
}

export async function GET(request:Request) {
    await dbConnect();
    const session = await getServerSession(nextAuthOptions);
    const user:User = session?.user as User;
    if(!session || !user){
        return Response.json(
            {
              success: false,
              message: "user not authenticated",
            },
            { status: 500 }
          );
    }
    const userId = user._id;

    try {
        const Founduser = await UserModel.findById(userId);
        if(!Founduser){
            return Response.json(
                {
                  success: false,
                  message: "unable to find User",
                },
                { status: 404 }
              );
        }
        return Response.json(
            {
              success: true,
              message: "User fetched successfully",
              isAcceptingMessage: Founduser.isAcceptingMessage,
            },
            { status: 200 }
          );
    } catch (error) {
        console.log("Error while getting message acceptance status: ",error)
        return Response.json(
            {
              success: false,
              message: "unable to get message acceptance status",
            },
            { status: 500 }
          );
    }
}