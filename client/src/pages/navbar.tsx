import { Link, useNavigate } from "react-router-dom";
import { authenticated } from "@/store/atoms/authenticated";
import { useRecoilState } from "recoil";

function Navbar() {

    const navigate = useNavigate();

    const [authenticatedValue, setAuthenticatedValue] = useRecoilState(authenticated);

    function toRoutines() {

        navigate('/routines');

    }

    function logout() {

        localStorage.removeItem('jwt');

        setAuthenticatedValue(false);

        navigate('/login');

    }

    return (
        <div className="px-4 lg:px-6 lg:py-6 h-14 flex items-center justify-between min-w-[400px] sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className='ml-3 text-2xl font-bold'>
                <button onClick={toRoutines}>Hevy</button>
            </div>
            <div className="flex gap-4 sm:gap-6 items-center">
                {
                    authenticatedValue &&
                    <Link className="text-base font-medium hover:underline underline-offset-4" to="/login" onClick={logout}>
                        Logout
                    </Link>
                }
                <div className="flex justify-center items-center gap-5 mr-3">
                    {
                        !authenticatedValue &&
                        <>
                            <Link className="text-base font-medium hover:underline underline-offset-4" to="/login">
                                Login
                            </Link>
                            <Link className="text-base font-medium hover:underline underline-offset-4" to="/signup">
                                Signup
                            </Link>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar;
