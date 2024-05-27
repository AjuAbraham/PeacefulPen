'use client'
import * as z from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const VerifyCode = () => {
    const params = useParams<{username: string}>();
    const route = useRouter();
    const {toast} = useToast();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
      });
    
    const onSubmit = async(data:z.infer<typeof verifySchema> )=>{
        try {
            const res = await axios.post(`/api/verify-code`,{
                username:params.username,
                code: data.code
            })

            toast({
                title: res.data.success=== true? "Success": "Failed",
                description: res.data.message
            })
            route.replace('/sign-in');
        } catch (error) {
            console.error("Error while verify is: ",error);
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "SignUp Failed",
                description: axiosError.response?.data.message,
                variant:'destructive'
            })
        }

    }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='bg-white w-full max-w-md  p-8 space-y-8 rounded-lg shdaow-md'>
        <div className='text-center'>
            <h1 className='text-4xl font-extrabold tracking-tight mb-6'>Verify Your Account</h1>
            <p className='mb-4'>Enter verification code send to your email</p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Verify Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
      </div>
    </div>
  )
}

export default VerifyCode
