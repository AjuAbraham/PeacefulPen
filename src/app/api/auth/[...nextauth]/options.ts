import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";

export const nextAuthOptions:NextAuthOptions ={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                email: { label: "email", type: "email", placeholder: "email" },
                password: { label: "Password", type: "password" }  
            },
            async authorize(credentials:any): Promise<any>{
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        email:credentials.email
                    })
                    if(!user){
                        throw new Error("User don't exsist");
                    }
                    if(!user.isVerified){
                        throw new Error("User is not verified");
                    }
                    const verifyPassword = await bcrypt.compare(credentials.password,user.password);
                    if(!verifyPassword){
                        throw new Error("Incorrect password");
                    }
                    else{
                        return user;
                    }          
                } catch (error:any) {
                    throw new Error(error);
                }
            }
        })
    ],
    pages:{
        signIn: "/sign-in",
    },
    session:{
        strategy:"jwt"
    },
    secret: process.env.AUTH_SECRET,
    callbacks:{
        async session({session,token}){
            if(token){
                session.user._id= token._id?.toString();
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username; 
            }
            return session;
        },
        async jwt({token,user}){
            if(user){
                token._id= user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        }
    }
}