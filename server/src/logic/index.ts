const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser')
import { PrismaClient } from '@prisma/client';
import { Request, Response , NextFunction, response} from 'express';

const app = express();
const prisma = new PrismaClient();
const port = 3000;

const adminSecretKey = "admin123";
const userSecretKey = "user123";

app.use(cors());
app.use(bodyParser.json());

interface customRequest extends Request{
    userId : number
}

async function authenticateAdmin(req : customRequest, res : Response, next : NextFunction){
    
    const token : String | any = req.headers.authorization?.split(' ')[1];

    const adminAuthenticated = await jwt.verify(token,adminSecretKey);

    if(adminAuthenticated)
    {
        next();
    }
    else
    {
        res.status(403).json({message : "admin authentication failed"});
    }

}

async function authenticateUser(req : customRequest, res : Response, next : NextFunction){

    const token = req.headers.authorization?.split(' ')[1];

    const userAuthenticated = await jwt.verify(token,userSecretKey);

    if(userAuthenticated)
    {
        const user = await prisma.user.findUnique({
            where : {
                email : userAuthenticated
            }
        })

        if(user)
        {
            req.userId = user.id;
            next();
        }
    }
    else
    {
        res.status(403).json({message : "user authentication failed"});
    }

}

app.post('/admin/signup',async (req : customRequest,res : Response)=>{

    const adminPresent = await prisma.admin.findUnique({
        where : {
            email : req.body.email
        }
    })

    if(adminPresent)
    {
        res.status(403).json({message : "admin already present"});
    }
    else
    {
        const adminAdded = await prisma.admin.create({
            data : {
                name : req.body.name,
                email : req.body.email,
                password : req.body.password
            }
        })

        if(adminAdded)
        {
            const token = await jwt.sign(req.body.email,adminSecretKey);
            res.status(201).json({message : "admin created successfully",adminAdded,token})
        }
        else
        {
            res.status(403).json({message : "admin signup failed"});
        }
    }

})

app.post('/admin/login', async (req : customRequest, res : Response)=>{
    
    const adminPresent = await prisma.admin.findUnique(
        {
            where : {
                email : req.body.email,
                password : req.body.password
            }
        }
    )

    if(adminPresent)
    {
        const token = await jwt.sign(req.body.email,adminSecretKey);
        res.status(200).json({message : "admin logged in successfully", token})
    }
    else
    {
        res.status(403).json({message : "admin login falied"});
    }

})

app.post('/admin/addExercise', authenticateAdmin, async (req : customRequest, res :Response)=>{

    const exerciseAdded = await prisma.exercise.create({
        data : {
            name : req.body.name
        }
    })

    if(exerciseAdded)
    {
        res.status(201).json({message : "exercise added", exerciseAdded});
    }
    else
    {
        res.status(403).json({message : "failed to add exercise"});
    }

})

app.get('/admin/getAllExercises', authenticateAdmin, async (req : Request, res : Response)=>{

    const allExercises : Array<Object> = await prisma.exercise.findMany();

    res.status(200).json(allExercises);

})

app.post('/user/signup', async (req : customRequest, res : Response)=>{
    
    const userPresent = await prisma.user.findUnique({
        where : {
            email : req.body.email
        }
    })

    if(userPresent)
    {
        res.status(403).json({mesaage : "user adready present"});
    }
    else
    {
        const userAdded = await prisma.user.create({
            data : req.body
        })

        if(userAdded)
        {
            const token = await jwt.sign(req.body.email,userSecretKey);
            res.status(201).json({message : "user successfully created", token});
        }
        else
        {
            res.status(403).json({message : "user signup failed"});
        }
        
    }

})

app.post('/user/login', async (req : customRequest, res : Response)=>{

    const userPresent = await prisma.user.findUnique({
        where : {
            email : req.body.email,
            password : req.body.password
        }
    })

    console.log(userPresent);

    if(userPresent)
    {
        const token = await jwt.sign(req.body.email,userSecretKey);
        res.status(200).json({message : "user successfully logged in", userPresent, token});
    }
    else
    {
        res.status(403).json({message : "user login failed"});
    }

})

app.post('/user/auth', async (req : customRequest, res : Response)=>{

    const token = req.headers.authorization?.split(' ')[1];
    
    if(token)
    {
        const userAuthenticated = await jwt.verify(token,userSecretKey);

        if(userAuthenticated)
        {
            res.status(200).send("authenticated");
        }
        else
        {
            res.status(200).send("not authenticated");
        }
    }
    else
    {
        res.status(200).send("not authenticated");
    }  

})

app.get('/user/getAllExercises', authenticateUser, async (req : customRequest, res : Response)=>{

    const allExercises : Array<Object> = await prisma.exercise.findMany();

    res.status(200).json(allExercises);

})

app.post('/user/addRoutine', authenticateUser, async (req : customRequest, res : Response)=>{

    const isRoutinePresent  = await prisma.routine.findUnique({
        where : {
            name : req.body.name
        },
    })

    if(isRoutinePresent)
    {
        res.status(200).send("routine with given name is already present");
    }
    else
    {
        const routineAdded = await prisma.routine.create({
            data : {
                name : req.body.name,
                userId : req.userId
            }
        })
    
        if(routineAdded)
        {
            for(let i=0;i<req.body.workout.length;i++)
            {
                const workoutAdded = await prisma.workout.create({
                    data : {
                        name : req.body.workout[i].name,
                        routineId : routineAdded.id
                    }
                })
    
                if(workoutAdded)
                {
                    for(let j=0;j<req.body.workout[i].set.length;j++)
                    {
                        const setAdded = await prisma.set.create({
                            data : {
                                weight : req.body.workout[i].set[j].weight,
                                count : req.body.workout[i].set[j].count,
                                workoutId : workoutAdded.id
                            }
                        })
                    }
                }
            }
    
            res.status(201).json({message : "routine successfully created", routineAdded});
        }
        else
        {
            res.status(403).json({message : "add routine failed"});
        }
    }

})

app.put('/user/updateRoutine/:id', authenticateUser, async (req : customRequest, res : Response)=>{

    const routineUpdated = await prisma.routine.update({
        where : {
            id : +req.params.id
        },
        data : {
            name : req.body.name
        }
    })

    if(routineUpdated)
    {

        var workoutArray = [];

        for(let i=0;i<req.body.workout.length;i++)
        {
            const workoutPresent = await prisma.workout.findUnique({
                where : {
                    id : req.body.workout[i].id
                }
            })

            if(workoutPresent)
            {

                var a = 9;

                workoutArray.push(workoutPresent.id);

                const workoutUpdated = await prisma.workout.update({
                    where : {
                        id : req.body.workout[i].id,
                        routineId : routineUpdated.id
                    },
                    data : { 
                        name : req.body.workout[i].name
                    }
                })
    
                if(workoutUpdated)
                {

                    const setArray = [];

                    for(let j=0;j<req.body.workout[i].set.length;j++)
                    {

                        const setPresent = await prisma.set.findUnique({
                            where : {
                                id : req.body.workout[i].set[j].id
                            }
                        })
                        
                        if(setPresent)
                        {

                            setArray.push(setPresent.id);

                            const setUpdated = await prisma.set.update({
                                where : {
                                    id : req.body.workout[i].set[j].id,
                                    workoutId : req.body.workout[i].id
                                },
                                data : {
                                    weight : req.body.workout[i].set[j].weight,
                                    count : req.body.workout[i].set[j].count
                                }
                            })
                        }
                        else
                        {
                            const newSet = await prisma.set.create({
                                data : {
                                    weight : req.body.workout[i].set[j].weight,
                                    count : req.body.workout[i].set[j].count,
                                    workoutId : req.body.workout[i].id
                                }
                            })
                            
                            setArray.push(newSet.id);

                        }
    
                    }

                    const allSets = await prisma.set.findMany({
                        where : {
                            workoutId : workoutUpdated.id
                        },
                        select : {
                            id : true
                        }
                    })

                    for(let i=0;i<allSets.length;i++)
                    {
                        if(!setArray.includes(allSets[i].id))
                        {
                            const setDelete = await prisma.set.delete({
                                where : {
                                    id : allSets[i].id,
                                    workoutId : workoutUpdated.id
                                }
                            })
                        }
                    }

                }
            }
            else
            {

                const workoutAdded = await prisma.workout.create({
                    data : {
                        name : req.body.workout[i].name,
                        routineId : +req.params.id
                    }
                })
                
                workoutArray.push(workoutAdded.id);

                if(workoutAdded)
                {
                    for(let j=0;j<req.body.workout[i].set.length;j++)
                    {
                        const setAdded = await prisma.set.create({
                            data : {
                                weight : req.body.workout[i].set[j].weight,
                                count : req.body.workout[i].set[j].count,
                                workoutId : workoutAdded.id
                            }
                        })
                    }
                }
            }

        }   

        const allWorkoutsId = await prisma.workout.findMany({
            where : {
                routineId : +req.params.id
            },
            select : {
                id : true
            }
        })

        console.log(allWorkoutsId);
        
        for(let i=0;i<allWorkoutsId.length;i++)
        {
            if(workoutArray.includes(allWorkoutsId[i].id))
            {

            }
            else
            {
                console.log("reached");

                const deleteWorkout = await prisma.workout.delete({
                    where : {
                        id : allWorkoutsId[i].id,
                        routineId : +req.params.id
                    }
                })
            }
        }

        res.status(200).json({message : "routine updated", routineUpdated});
    }
    else
    {
        res.status(403).json({message : "update routine failed"})
    }

})

app.delete('/user/deleteRoutine/:id', authenticateUser, async (req :customRequest, res:Response)=>{

    const deletedRoutine = await prisma.routine.delete({
        where : {
            // unary operator (+) used to typecast -> string to number
            id : +req.params.id,
            userId : req.userId
        }
    })

    if(deletedRoutine)
    {
        res.status(200).json({ message : "Rountine successfully deleted" ,deletedRoutine});
    }
    else
    {
        res.status(403).json({message : "delete rountie failed"});
    }

})

app.get('/user/allRoutines', authenticateUser, async (req : customRequest ,res : Response)=>{

    const allRoutines = await prisma.routine.findMany({
        where : {
            userId : req.userId
        }
    })

    if(allRoutines)
    {
        res.status(200).json(allRoutines);
    }
    else
    {
        res.status(403).json({message : "failed to get all routines"});
    }

})

app.get('/user/routine/:id', authenticateUser, async (req : customRequest, res : Response )=>{

    const routine = await prisma.routine.findUnique({
        where : {
            id : +req.params.id,
            userId : req.userId
        },
        include : {
            workout : {
                include : {
                    set : true
                }
            }
        }
    })

    if(routine)
    {
        res.status(200).json(routine);
    }
    else
    {
        res.status(403).json({message : "failed to get routine"});
    }

})  


app.listen( port , ()=>{console.log("listening to port "+ port )});



