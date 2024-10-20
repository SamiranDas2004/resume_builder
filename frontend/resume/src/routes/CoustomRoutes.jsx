import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../auth/Login'
import Signup from '../auth/Signup'
import App from '../App'
function CoustomRoutes() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<App/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
        </Routes>
    </div>
  )
}

export default CoustomRoutes