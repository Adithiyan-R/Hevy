import { useNavigate } from "react-router-dom";

function Navbar(){

    const navigate = useNavigate();

    function toRoutines(){

        navigate('/user/routines');

    }

    function logout(){

        localStorage.removeItem('jwt');

        navigate('/user/login');

    }

    return(
        <div className='flex justify-between w-full h-15 bg-gradient-to-r from-cyan-500 to-blue-500 ...'> 
            <div className='p-3 ml-5 text-lg font-mono font-bold'>
                <button onClick={toRoutines}>Todo</button>
            </div>
            <div className='p-3 mr-5 text-lg font-mono font-bold'>
                <button onClick={logout}>logout</button>
            </div>
        </div>
    )
}

export default Navbar;

