import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Routine from './pages/routine';
import AllRoutine from './pages/allRoutine';
import AddRoutine from './pages/addRoutine';
import Login from './pages/login';
import Signup from './pages/signup';
import Navbar from './pages/navbar';
import { HomePage } from './pages/homePage';

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/create-routine' element={<AddRoutine />} />
          <Route path='/routines' element={<AllRoutine />} />
          <Route path='/routine/:id' element={<Routine />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;

