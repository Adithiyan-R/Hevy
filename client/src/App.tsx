import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Routine from './pages/routine';
import AllRoutine from './pages/allRoutine';
import AddRoutine from './pages/addRoutine';
import Login from './pages/login';
import Signup from './pages/signup';

function App() {

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path='/user/login' element={<Login/>}/>
                <Route path='/user/signup' element={<Signup/>}/>
                <Route path='/user/addRoutine' element={<AddRoutine/>}/>
                <Route path='/user/routines' element={<AllRoutine/>}/>
                <Route path='/user/routine/:id' element={<Routine/>}/>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App;

