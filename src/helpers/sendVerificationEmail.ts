import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/emailTemplate";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(email:string,username:string,verificationCode:string):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from:'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verify to FeedBacker',
            react: VerificationEmail({username,otp:verificationCode}),
          });
          return {success:true,message:"Verification email send successfully"}
    } catch (error) {
        console.error("Error while sending verification email : ",error);
        return {success:false,message:"failed to send verification email"}
    }
}