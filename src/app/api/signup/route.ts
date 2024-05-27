import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email, username, password } = await request.json();
    const exsistingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (exsistingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username already exsist" },
        { status: 400 }
      );
    }
    const exsistingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (exsistingUserByEmail) {
      if(exsistingUserByEmail.isVerified){
        return Response.json({success:false,message:"User already exsist"},{status:400})
      }
      else{
        const hashedPassword = await bcrypt.hash(password,10);
        exsistingUserByEmail.password = hashedPassword;
        exsistingUserByEmail.verifyCode = verifyCode;
        exsistingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)
        await exsistingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expieryDate = new Date();
      expieryDate.setHours(expieryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expieryDate,
        messages: [],
      });
      await newUser.save();
    }
    const emailRes = await sendVerificationEmail(username, email, verifyCode);
    console.log("Email logs are: ",emailRes);
    if (!emailRes.success) {
      return Response.json(
        {
          success: false,
          message: emailRes.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while registering user: ", error);
    return Response.json(
      {
        success: false,
        message: "Error while registering user",
      },
      { status: 500 }
    );
  }
}
