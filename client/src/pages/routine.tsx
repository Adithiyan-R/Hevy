import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import '../index.css';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import { routineNameAtom, routineWorkoutAtom } from "@/store/atoms/routine";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Button } from "@/components/ui/button";

function Routine(){

    const [name,setName] = useRecoilState(routineNameAtom);
    const [workout,setWorkout] = useRecoilState(routineWorkoutAtom);

    const [exercises,setExercises] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    async function getRountine() {
        
        try{
            const response = await axios.get("http://localhost:3000/user/routine/"+location.state.id,
            {
                headers : {
                    Authorization : "Bearer " + localStorage.getItem('jwt')
                }
            })

            console.log(response.data);

            setName(response.data.name);
            setWorkout(response.data.workout);

        }
        catch(e){
            console.log(e);
        }
        
    }

    async function updateRoutineHandler(){

        try
        {

            const routine = {
                name,
                workout
            }

            console.log(routine);

            const response = await axios.put("http://localhost:3000/user/updateRoutine/"+location.state.id,
            {
                name,
                workout
            },
            {
                headers : {
                    Authorization : "Bearer " + localStorage.getItem('jwt')
                }
            })

            console.log(response.data);

            navigate('/user/routines');

            setName("");
            setWorkout([]);

        }   
        catch(e)
        {
            console.log(e);
        }

    }

    async function getExercises() {
    
        try{

            const response = await axios.get("http://localhost:3000/user/getAllExercises",
            {
                headers : {
                    Authorization : "Bearer " + localStorage.getItem('jwt')
                }
            })

            setExercises(response.data);

            console.log(response.data);

        }
        catch(e){

            console.log(e);

        }

    }

    useEffect(()=>{
        console.log(location.state.id);
        getRountine();

        getExercises();

        console.log(workout);
        console.log(name);
    },[])

    return(
        <div>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50}>
                    <div>
                        <input value={name} type="text" onChange={(e)=>setName(e.target.value)}></input>
                        {workout.map((value : any)=> <DisplayWorkout name={value.name} set={value.set} id={value.id}/>)}
                        <br/>
                        <br/>
                        <button onClick={updateRoutineHandler}>update routine</button>
                    </div>
                </ResizablePanel>
                <ResizableHandle/>
                <ResizablePanel defaultSize={50}>
                    <div>
                        {exercises.map((value : any)=> <DisplayExercise name={value.name}/>)}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

function DisplayWorkout(props : any){

    const setWorkout : any = useSetRecoilState(routineWorkoutAtom);

    function addNewSet(){

        const newSet = {
            id : Math.random(),
            weight : 0,
            count : 0
        }

        setWorkout((x : any)=>{
            return x.map((value : any)=>{
                if(value.id===props.id)
                {
                    return {
                        ...value,
                        set : [...value.set,newSet]
                    }
                }
                return value;
            })
        });

    }

    function deleteWorkout(){

        setWorkout((x : any) => {
            return x.filter((value : any)=>{ return value.id != props.id})
        })

    }

    return(
        <div >
            {props.name}
            <br/>
            <button onClick={deleteWorkout}>delete workout</button>
            <br/>
            <button onClick={addNewSet}>add new set</button>
            {props.set.map((value : any)=> <DisplaySet set={value} workoutId={props.id}/>)}
            <br/>
        </div>
    )

}

function DisplaySet(props : any){

    const setWorkout : any = useSetRecoilState(routineWorkoutAtom);

    function deleteSet(){

        setWorkout((x : any) => {
            return x.map((value : any) => {

                if(value.id === props.workoutId)
                {
                    const sets = value.set.filter((item : any) => { return item.id != props.set.id })
                    const result  = {
                        id : value.id,
                        name : value.name,
                        set : sets
                    }
                    return result;
                }
                return value;
            })
        })

    }

    function setWeight(weight : number){

        setWorkout((x : any) => {

            return x.map((value : any) => {

                if(value.id === props.workoutId)
                {
                    const sets = value.set.map((item : any) => {
                        if(item.id === props.set.id)
                        {
                            const newSet = {
                                id : item.id,
                                weight : weight,
                                count : item.count
                            }

                            return newSet;
                        }
                        return item;
                    })

                    const result = {
                        id : value.id,
                        name : value.name,
                        set : sets
                    }
                    
                    return result;
                }
                return value;
            })

        })

    }

    function setCount(count : number){
        
        setWorkout((x : any) => {

            return x.map((value : any) => {

                if(value.id === props.workoutId)
                {
                    const sets = value.set.map((item : any) => {
                        if(item.id === props.set.id)
                        {
                            const newSet = {
                                id : item.id,
                                weight : item.weight,
                                count : count
                            }

                            return newSet;
                        }
                        return item;
                    })

                    const result = {
                        id : value.id,
                        name : value.name,
                        set : sets
                    }
                    
                    return result;
                }
                return value;
            })

        })

    }

    return(
        <div>
            <input value={props.set.weight} onChange={(e)=>{setWeight(+e.target.value)}}></input>
            <input value={props.set.count} onChange={(e)=>{setCount(+e.target.value)}}></input>
            <button onClick={deleteSet}>delete set</button>
        </div>
    )

}

function DisplayExercise(props : any){

    // type input = {
    //         name : String,
    //         set : [{
    //             weight : Number,
    //             count : Number
    //         }]
    //     }

    const setWorkout : any = useSetRecoilState(routineWorkoutAtom);

    function addToWorkout(){
        
        const newSet = [{
            id : Math.random(),
            weight : 0,
            count : 0
        }]

        const newWorkout = {
            id : Math.random(),
            name : props.name,
            set : newSet
        }

        setWorkout((prevWorkout : []) => [...prevWorkout, newWorkout]);

    }
    
    return(
        <div>
            <Button onClick={addToWorkout}>{props.name}</Button>
        </div>
    )

}

export default Routine;
