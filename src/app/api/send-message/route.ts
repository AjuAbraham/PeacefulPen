import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/user.model";

export async function POST(request:Request) {
    await dbConnect();

    try {
        const {username,content} = await request.json();
        if(!username || !content){
            return Response.json(
                {
                  success: false,
                  message: "Provide to get username or content",
                },
                { status: 400 }
              );
        }
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json(
                {
                  success: false,
                  message: "Unable to get user",
                },
                { status: 500 }
              );
        }
        //is intended user is accepting messages
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                  success: false,
                  message: "User is not accepting messages",
                },
                { status: 403 }
              );
        } 
         const newMessage = {content,createdAt: new Date()}
         user.messages.push(newMessage as Message);
         await user.save();
         return Response.json(
            {
              success: true,
              message: "Message sent successfully",
            },
            { status: 200 }
          );
    } catch (error) {
        console.log("Error while sending message: ",error);
        return Response.json(
            {
              success: false,
              message: "Unable to get messages",
            },
            { status: 401 }
          );
    }
    
}