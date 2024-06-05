import { useState } from "react";
import axios,{ AxiosResponse} from "axios";
import { useNavigate } from "react-router-dom";
import '../index.css';

function Login(){

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();

    async function loginHandler() {
        
        try{
            const response : AxiosResponse = await axios.post("http://localhost:3000/user/login",
            {
                email,
                password
            })

            localStorage.setItem('jwt',response.data.token);

            console.log(response.data);

            navigate('/user/routines');
        }
        catch(e){
            console.log(e);
        }

    }

    return(
        <div>
            <input type="text" value={email} placeholder="enter email" onChange={(e)=>{setEmail(e.target.value)}}></input>
            <input type="text" value={password} placeholder="enter password" onChange={(e)=>{setPassword(e.target.value)}}></input>
            <button onClick={loginHandler}>login</button>
        </div>
    )
}

export default Login;