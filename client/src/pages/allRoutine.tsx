import { useState, useEffect } from "react";
import axios, { AxiosResponse} from "axios";
import { useNavigate } from "react-router-dom";
import '../index.css';

import { Button } from "@/components/ui/button";

function AllRoutine(){

    const [routines,setRoutines] = useState([]);

    const navigate = useNavigate();

    async function getAllRoutines(){

        try
        {
            const response : AxiosResponse = await axios.get("http://localhost:3000/user/allRoutines",
            {
                headers : {
                    Authorization : "Bearer " + localStorage.getItem('jwt')
                }
            })
            
            setRoutines(response.data)

            console.log(response);
        }
        catch(e)
        {
            console.log(e);
        }

    }

    async function addRoutine(){
        navigate('/user/addRoutine');
    }

    useEffect(()=>{

        console.log('reached');

        getAllRoutines();
    },[])

    return(
        <div>
            <Button onClick={addRoutine}>add routine</Button>
            {routines.map((value  : any)=> <DisplayRoutine name={value.name} id={value.id} getAllRoutines={getAllRoutines}/>)}
        </div> 
    )
}

function DisplayRoutine(props : any){

    const navigate = useNavigate();

    async function viewRoutineHandler(){
        navigate('/user/routine/'+props.id,
        {
            state : {
                id : props.id
            }
        });
    }

    async function deleteRoutineHandler(){

        try
        {
            const response = await axios.delete("http://localhost:3000/user/deleteRoutine/"+props.id,
            {
                headers : {
                    Authorization : "Bearer " + localStorage.getItem('jwt')
                }
            })

            console.log(response.data);

            props.getAllRoutines();
        }
        catch(e)
        {
            console.log(e); 
        }

    }

    return(
        <div>
            {props.name}
            <button onClick={viewRoutineHandler}>view</button>
            <button onClick={deleteRoutineHandler}>delete</button>
        </div>
    )

}

export default AllRoutine;