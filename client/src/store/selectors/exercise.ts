import { selector } from "recoil";
import { exerciseAtom } from "../atoms/exercise";
import { exerciseFilter } from "../atoms/exercise";

type exercise = {
    name : string
}

export const filteredExercise = selector({
    key: 'FilteredExercise',
    get: ({get}) => {
        const filter = get(exerciseFilter);
        const exercises : exercise | any = get(exerciseAtom);

        if(filter==="")
        {
            return exercises;
        }    
        else
        {
            let filtered = [];
            for(let i=0;i<exercises.length;i++)
            {
                if(exercises[i].name.includes(filter))
                {
                    filtered.push(exercises[i]);
                }
            }
            return filtered;
        }
        
    },
});