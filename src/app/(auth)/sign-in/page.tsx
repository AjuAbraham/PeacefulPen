"use client"

import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const SignIn = () => {
  const router = useRouter();
  const {toast} = useToast();
  const [handleSubmit, sethandleSubmit] = useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues:{
      email: "",
      password: ""
    }
  })
  const onSubmit = async(data:z.infer<typeof signInSchema>)=>{
    sethandleSubmit(true);
    const result = await signIn('credentials',{
      email: data.email,
      password: data.password,
      redirect:false,
    });
    console.log("result is : ",result );
    if(result?.error){
      toast({
        title:"Login Failed",
        description:result.error,
        variant: 'destructive'
      })
    }
    sethandleSubmit(false);
    if(result?.url){
      router.replace('/home');
    }
    
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Supressed
          </h1>
          <p className="mb-4">Log In to Start your hidden story</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
             
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input   placeholder="Email" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input   placeholder="Password" type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={handleSubmit}>
              {handleSubmit ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> please wait
                </>
              ) : (
                "SignIn"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SignIn
