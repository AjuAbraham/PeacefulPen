import {z} from 'zod';

export const usernameValidation = z.string()
        .min(3,{message:"Username must be atleast 3 characters"})
        .max(20,{message:"Username must be atmost 20 characters"})
        .regex(/^[a-zA-Z0-9_]+$/,{message:"Username must not contain special character"})

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"Invalid email address"}),
    password: z.string().min(6,{message:"Password must be of alteast 6 characters"})
})