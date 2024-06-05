import { atom } from "recoil";

export const routineNameAtom = atom({
    key : "routineNameAtom",
    default : ""
})

export const routineWorkoutAtom = atom({
    key : "routineWorkoutAtom",
    default : []
})