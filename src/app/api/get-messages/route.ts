import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { nextAuthOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function GET(request:Request) {
    await dbConnect();
    const session = await getServerSession(nextAuthOptions);
    const user:User = session?.user as User;
    if(!session || !user){
        return Response.json(
            {
              success: false,
              message: "User not authenticated",
            },
            { status: 401 }
          );
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
          {$match:{id: userId}},
          {$unwind:"$messages"},
          {$sort:{"messages.createdAt":-1}},
          {$group:{_id:"$_id",messages:{$push:"$messages"}}},
        ])
        if(!user || user.length===0){
          return Response.json(
            {
              success: false,
              message: "Unable to get messages",
            },
            { status: 404 }
          );
        }
        return Response.json(
          {
            success: true,
            messages: user[0].messages,
          },
          { status: 200 }
        );
    } catch (error) {
      console.log("Error while getting messages: ",error);
      return Response.json(
        
        {
          success: false,
          message: "Unable to get User",
        },
        { status: 500 }
      );
    }
}
