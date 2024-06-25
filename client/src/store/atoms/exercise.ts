import { atom } from "recoil";

export const exerciseAtom = atom({
    key : "exerciseAtom",
    default : []
})

export const exerciseFilter = atom({
    key : "exerciseFilter",
    default : ""
})

export const switchAtom = atom({
    key : "switchAtom",
    default : false
})