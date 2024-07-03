import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../index.css';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { addRoutineNameAtom, addRoutineWorkoutAtom } from "@/store/atoms/addRoutine";
import { exerciseAtom, exerciseFilter } from "@/store/atoms/exercise";
import { filteredExercise } from "@/store/selectors/exercise";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { switchAtom } from "@/store/atoms/exercise";

function AddRoutine() {

    const [name, setName] = useRecoilState(addRoutineNameAtom);
    const [workout, setWorkout] = useRecoilState(addRoutineWorkoutAtom);

    const [exercises, setExercises] = useRecoilState(exerciseAtom);
    const [exerciseFilterState, setExerciseFilterState] = useRecoilState(exerciseFilter);
    const filteredExercises = useRecoilValue(filteredExercise);
    const [toggle, setToggle] = useRecoilState(switchAtom);

    const navigate = useNavigate();

    async function addRoutineHandler() {

        try {

            const response = await axios.post("http://localhost:3000/user/addRoutine",
            {
                name,
                workout
            },
            {
                headers: {
                   Authorization: "Bearer " + localStorage.getItem('jwt')
                }
            })

            if(response.data==="routine with given name is already present")
            {
                alert("routine with this name is already present");
            }
            else
            {
                navigate('/routines');

                setName("");
                setWorkout([]);
            }

        }
        catch (e) {
            console.log(e);
        }

    }

    async function getExercises() {

        try {

            const response = await axios.get("http://localhost:3000/user/getAllExercises",
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem('jwt')
                    }
                })

            setExercises(response.data);

            console.log(response.data);

        }
        catch (e) {

            console.log(e);

        }

    }

    useEffect(() => {

        console.log(workout + " useEffect");

        getExercises();

    }, []);

    function filter() {
        console.log("reached1");
        if (exerciseFilterState == "") {
            console.log("reached2");
            setToggle(false);
            return;
        }
        setToggle(true);
    }

    return (
        <div>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={70}>
                    <div className="space-y-2 px-20">
                        <div className="space-y-2 pt-8">
                            <Label htmlFor="name" className="text-lg font-medium">Name</Label>
                            <div className="flex items-center justify-between">
                                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter routine name" />
                                <Button onClick={addRoutineHandler} className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 text-white mt-0.5 rounded-md h-10 font-medium shrink-0 mr-10 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">Save Routine</Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Workouts</h3>
                        </div>
                        {workout.map((value: any) => <DisplayWorkout name={value.name} set={value.set} id={value.id} />)}
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={30}>
                    <div className="pt-8 ">
                        <div className="flex w-80 pl-3">
                            <Input type="text" placeholder="exercise" value={exerciseFilterState} onChange={(e) => setExerciseFilterState(e.target.value)} />
                            <button className="pl-2" onClick={filter}>search</button>
                        </div>
                        {toggle ? filteredExercises.map((value: any) => <DisplayExercise name={value.name} />) : exercises.map((value: any) => <DisplayExercise name={value.name} />)}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )

}

function DisplayExercise(props: any) {

    const setWorkout: any = useSetRecoilState(addRoutineWorkoutAtom);

    function addToWorkout() {

        const newSet = [{
            id: Math.random(),
            weight: 0,
            count: 0
        }]

        const newWorkout = {
            id: Math.random(),
            name: props.name,
            set: newSet
        }

        setWorkout((prevWorkout: []) => [...prevWorkout, newWorkout]);

    }

    return (
        <div>
            <Button className="text-base" onClick={addToWorkout}>&#43; {props.name}</Button>
        </div>
    )

}

function DisplayWorkout(props: any) {

    const setWorkout: any = useSetRecoilState(addRoutineWorkoutAtom);

    function addNewSet() {

        const newSet = {
            id: Math.random(),
            weight: 0,
            count: 0
        }

        setWorkout((x: any) => {
            return x.map((value: any) => {
                if (value.id === props.id) {
                    return {
                        ...value,
                        set: [...value.set, newSet]
                    }
                }
                return value;
            })
        });

    }

    function deleteWorkout() {

        setWorkout((x: any) => {
            return x.filter((value: any) => { return value.id != props.id })
        })

    }

    return (
        <div className="space-y-2">
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <div className='ml-3 text-xl font-bold'>
                        <p className="text-lg font-medium">{props.name}</p>
                    </div>
                    <div className="flex justify-center items-center gap-5 mr-3">
                        <Button type="button" onClick={addNewSet} className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 text-white mt-0.5 rounded-md h-10 font-medium shrink-0 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
                            Add Set
                        </Button>
                        <Button type="button" onClick={deleteWorkout} className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 text-white mt-0.5 rounded-md h-10 font-medium shrink-0 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
                            Delete Workout
                        </Button>
                    </div>
                </div>
                <div className="flex">
                    <div className="ml-20">
                        <Label>Weight</Label>
                    </div>
                    <div className="ml-64">
                        <Label>Count</Label>
                    </div>
                </div>
                {props.set.map((value: any) => <DisplaySet set={value} workoutId={props.id} />)}
                <br />
            </div>
        </div>
    )

}

function DisplaySet(props: any) {

    const setWorkout: any = useSetRecoilState(addRoutineWorkoutAtom);

    function deleteSet() {

        setWorkout((x: any) => {
            return x.map((value: any) => {

                if (value.id === props.workoutId) {
                    const sets = value.set.filter((item: any) => { return item.id != props.set.id })
                    const result = {
                        id: value.id,
                        name: value.name,
                        set: sets
                    }
                    return result;
                }
                return value;
            })
        })

    }

    function setWeight(weight: number) {

        setWorkout((x: any) => {

            return x.map((value: any) => {

                if (value.id === props.workoutId) {
                    const sets = value.set.map((item: any) => {
                        if (item.id === props.set.id) {
                            const newSet = {
                                id: item.id,
                                weight: weight,
                                count: item.count
                            }

                            return newSet;
                        }
                        return item;
                    })

                    const result = {
                        id: value.id,
                        name: value.name,
                        set: sets
                    }

                    return result;
                }
                return value;
            })

        })

    }

    function setCount(count: number) {

        setWorkout((x: any) => {

            return x.map((value: any) => {

                if (value.id === props.workoutId) {
                    const sets = value.set.map((item: any) => {
                        if (item.id === props.set.id) {
                            const newSet = {
                                id: item.id,
                                weight: item.weight,
                                count: count
                            }

                            return newSet;
                        }
                        return item;
                    })

                    const result = {
                        id: value.id,
                        name: value.name,
                        set: sets
                    }

                    return result;
                }
                return value;
            })

        })

    }

    return (
        <div className="flex justify-between">
            <div className="space-y-1 w-50 ml-20">
                <Input value={props.set.weight} type="number" onChange={(e) => setWeight(+e.target.value)} />
            </div>
            <div className="space-y-1 w-50 pl-4">
                <Input value={props.set.count} type="number" onChange={(e) => setCount(+e.target.value)} />
            </div>
            <div className="ml-25 w-1/5">
                <Button onClick={deleteSet} className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 text-white mt-0.5 ml-10 rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">delete set</Button>
            </div>
        </div>
    )

}

export default AddRoutine;