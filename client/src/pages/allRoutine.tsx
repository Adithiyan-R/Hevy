import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import '../index.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRecoilState } from "recoil";
import { authenticated } from "@/store/atoms/authenticated";
import { motion } from "framer-motion";

function AllRoutine() {

  const [routines, setRoutines] = useState([]);

  const [authenticatedValue,setAuthenticatedValue] = useRecoilState(authenticated)

  const navigate = useNavigate();

  async function getAllRoutines() {

    try {
      const response: AxiosResponse = await axios.get("https://hevy-server.vercel.app/user/allRoutines",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem('jwt')
          }
        })

      setAuthenticatedValue(true);

      setRoutines(response.data)

      console.log(response);
    }
    catch (e) {
      console.log(e);
    }

  }

  async function addRoutine() {
    navigate('/create-routine');
  }

  useEffect(() => {

    if(authenticatedValue===true)
    {
      getAllRoutines();
    }

  }, [])

  return (
    <div>
      { authenticatedValue && <div>
      <div className="flex items-center justify-center">
        <Button onClick={addRoutine} className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 text-white mt-10 rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">New Routine</Button>
      </div>
      <div className="flex items-center justify-center mt-10">
        <div className="grid grid-cols-4 gap-36">
          {routines.map((value: any) => <DisplayRoutine name={value.name} id={value.id} getAllRoutines={getAllRoutines} />)}
        </div>
      </div>
    </div>}
    {
      !authenticatedValue && 
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
    }
    </div>
  )
}

function DisplayRoutine(props: any) {

  const navigate = useNavigate();

  async function viewRoutineHandler() {
    navigate('/routine/' + props.id,
      {
        state: {
          id: props.id
        }
      });
  }

  async function deleteRoutineHandler() {

    try {
      const response = await axios.delete("https://hevy-server.vercel.app/user/deleteRoutine/" + props.id,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem('jwt')
          }
        })

      console.log(response.data);

      props.getAllRoutines();
    }
    catch (e) {
      console.log(e);
    }

  }

  return (
    <Card className="max-w-60 border-none">
      <CardContent className="p-6 flex flex-col items-center justify-between h-full ">
        <div className="text-center">
          <text className="text-lg font-bold break-words">{props.name}</text>
        </div>
        <div className="flex gap-4 mt-4">
          <Button className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]" onClick={viewRoutineHandler}>
            View
          </Button>
          <Button className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]" onClick={deleteRoutineHandler}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )

}

export default AllRoutine;