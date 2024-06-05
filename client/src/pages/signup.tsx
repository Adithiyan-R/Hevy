import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import '../index.css';

import { Button } from "@/components/ui/button"
import {z} from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";

function Signup(){

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();

    async function signupHandler(){

        try{

            console.log("reached");

            const response : AxiosResponse = await axios.post("http://localhost:3000/user/signup",
            {
                name,
                email,
                password
            })

            localStorage.setItem('jwt',response.data.token);

            console.log(response.data);

            navigate('/user/routines');

        }
        catch(e){
            console.log(e);
        }

    }

    // const FormSchema = z.object({
    //     name: z.string().min(3, {message: "Username must be at least 2 characters"}),
    //     email : z.string().min(7,{message : "This field is mandatory"}).email("Enter valid email"),
    //     password : z.string().min(7, {message : "Password should be atleast 7 characters"})
    //   })

    //   const form = useForm<z.infer<typeof FormSchema>>({
    //     resolver: zodResolver(FormSchema),
    //     defaultValues: {
    //       name: "",
    //       email : "",
    //       password : ""
    //     },
    //   })

    useEffect(()=>{
        
    },[])

    return(
            // <div className="bg-white p-8 rounded shadow-md w-full sm:w-1/2 lg:w-1/3">
            //         <input type="text" value={name} placeholder="enter name" onChange={(e)=>{setName(e.target.value)}}></input>
            //         <input type="text" value={email} placeholder="enter email" onChange={(e)=>{setEmail(e.target.value)}}></input>
            //         <input type="text" value={password} placeholder="enter password" onChange={(e)=>{setPassword(e.target.value)}}></input>
            //         <button onClick={signupHandler}>signup</button>
            // </div>
            <div className="bg-gray-900 text-white">
                <div className="flex h-screen">
                    <div className="flex w-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
                    <div className="w-full px-6 py-12 md:px-12">
                        <div className="mx-auto max-w-lg">
                        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
                        <p className="text-center text-gray-500">Create your account</p>
                        <form className="mt-6">
                            <div className="mb-6">
                            <label className="block mb-2 text-sm">Name</label>
                            <input type="text" id="name" className="w-full px-3 py-2 placeholder-gray-500 border rounded-md dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="john@example.com" required />
                            </div>
                            <div className="mb-6">
                            <label className="block mb-2 text-sm">Email</label>
                            <input type="email" id="email" className="w-full px-3 py-2 placeholder-gray-500 border rounded-md dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="john123" required />
                            </div>
                            <div className="mb-6">
                            <label className="block mb-2 text-sm">Password</label>
                            <input type="password" id="password" className="w-full px-3 py-2 placeholder-gray-500 border rounded-md dark:border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="••••••••" required />
                            </div>
                            {/* <div className="flex items-center justify-between mb-6">
                            <div className="form-group form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                                <label className="form-check-label" for="exampleCheck1">Remember me</label>
                            </div>
                            <a href="#" className="text-sm text-blue-500 hover:underline dark:text-blue-400">Forgot password?</a>
                            </div> */}
                            <button type="submit" onClick={signupHandler} className="w-full px-4 py-2 text-center text-base font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500">Sign Up</button>
                        </form>
                        {/* <p className="mt-6 text-center text-gray-500">Already have an account? <a href="#" className="text-sm text-blue-500 hover:underline dark:text-blue-400">Log in</a></p> */}
                        </div>
                    </div>
                    </div>
                </div>
            </div>          
    )
}

export default Signup;
