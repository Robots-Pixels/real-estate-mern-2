import React from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import About from './Pages/About'
import Profile from './Pages/Profile'


export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/sign-up' element={<SignUp/>}></Route>
          <Route path='/sign-in' element={<SignIn/>}></Route>
          <Route path='/about' element={<About/>}></Route>
          <Route path='/profile' element={<Profile/>}></Route>
        </Routes>
      </BrowserRouter>
  )
}
