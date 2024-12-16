import React from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Home from './Pages/Home.jsx'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import About from './Pages/About'
import Profile from './Pages/Profile'
import Header from './Components/Header.jsx'
import PrivateRoute  from './Components/PrivateRoute.jsx'


export default function App() {
  return (
      <BrowserRouter>

        <Header/>

        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/sign-up' element={<SignUp/>}></Route>
          <Route path='/sign-in' element={<SignIn/>}></Route>
          <Route path='/about' element={<About/>}></Route>

          <Route element={<PrivateRoute/>}>
            <Route path='/profile' element={<Profile />}></Route>
          </Route>
           
        </Routes>
      </BrowserRouter>
  )
}
