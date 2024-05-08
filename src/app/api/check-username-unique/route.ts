import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request:Request) {
    await dbConnect();

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get("username")
        }
        const result = usernameQuerySchema.safeParse(queryParam);
        console.log("result is: ",result);
        if(!result.success){
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message: usernameError?.length>0?usernameError.join(", "): "Invalid query paramter"
            },{status:400})
        }
        const {username} = result.data;
        const exsistingUser = await UserModel.findOne({username,isVerified:true});
        if(exsistingUser){
            return Response.json({
                success:false,
                message: "Username is already taken"
            },{status:400})
        }
        return Response.json({
            success:true,
            message: "Username is Available"
        },{status:200})

    } catch (error) {
        console.error("Error while checking username: ",error);
        return Response.json({
            success:false,
            message:"Error while checking username"
        },{status:500})
    }
}