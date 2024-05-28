import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";



export async function POST(request:Request) {
    await dbConnect();
    try {
        const {username,code} = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const exsistingUser = await UserModel.findOne({username:decodedUsername})
        if(!exsistingUser){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:500})
        }
        const checkVerifyCode = exsistingUser.verifyCode === code;
        const checkVerifyCodeExpiry = new Date(exsistingUser.verifyCodeExpiry)> new Date()
        if(checkVerifyCode && checkVerifyCodeExpiry){
            exsistingUser.isVerified=true;
            await exsistingUser.save();
            return Response.json({
                success:true,
                message:"User verified successfully"
            },{status:200})
        }
        else if(!checkVerifyCode){
            return Response.json({
                success:false,
                message:"Invalid verification Code"
            },{status:400})
        }
        else{
            return Response.json({
                success:false,
                message:"verification code expired please sign up again"
            },{status:400})
        }
         
    } catch (error) {
        console.error("Error while validating verification code: ",error);
        return Response.json({
            success:false,
            message:"Error while checking verification Code"
        },{status:500})
    }
}