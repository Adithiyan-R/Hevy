import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import '../index.css';
import { Input } from "@/components/ui/input";
import { authenticated } from "@/store/atoms/authenticated";
import { useSetRecoilState } from "recoil";
import { cn } from "@/utils/cn";
import { Label } from "@/components/ui/label"


function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setAuthenticatedValue = useSetRecoilState(authenticated);

  async function auth(){
      const response: AxiosResponse = await axios.post("https://hevy-server.vercel.app/user/auth",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem('jwt')
          }
        })

        if(response.data==="authenticated")
          {
            setAuthenticatedValue(true);
            navigate('/routines');
          }   
    }

  const navigate = useNavigate();

  async function signupHandler() {

    try {

      console.log("reached");

      const response: AxiosResponse = await axios.post("https://hevy-server.vercel.app/user/signup",
        {
          name,
          email,
          password
        })

      localStorage.setItem('jwt', response.data.token);

      console.log(response.data);

      setAuthenticatedValue(true);

      navigate('/routines');

    }
    catch (e) {
      console.log(e);
    }

  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    await signupHandler();
    console.log("Form submitted");

  };

  useEffect(()=>{
    auth();
  },[])
  
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Create an Account
      </h2>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Ben Cutting" type="text" onChange={(e) => setName(e.target.value)} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="ben@mail.com" type="email" onChange={(e) => setEmail(e.target.value)} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" auto-complete="section-blue shipping postal-code" onChange={(e) => setPassword(e.target.value)} />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
        </button>
      </form>
    </div>
  )
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default Signup;


