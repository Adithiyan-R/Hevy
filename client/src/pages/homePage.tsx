import { authenticated } from "@/store/atoms/authenticated";
import axios, { AxiosResponse } from "axios";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

export function HomePage() {

  const navigate = useNavigate();

  const setAuthenticatedValue = useSetRecoilState(authenticated);

  async function auth(){
    
      const response: AxiosResponse = await axios.post("http://localhost:3000/user/auth",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem('jwt')
          }
        })

        if(response.data==="authenticated")
          {
            console.log("okkk")
            setAuthenticatedValue(true);
            navigate('/routines');
          }   
    }

  useEffect(()=>{
    auth();
  },[])

  return (
    <motion.div
      initial={{ opacity: 0.0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="relative flex flex-col gap-4 items-center justify-center px-4 mt-48"
    >
      <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
        A place to log your workout records
      </div>
      <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
        Health is Wealth
      </div>
      <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2" onClick={() => { navigate('/signup') }}>
        Sign up
      </button>
    </motion.div>
  )
};
