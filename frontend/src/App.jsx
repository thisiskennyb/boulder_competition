
import React from "react"
import UserContext from "./contexts/UserContext"
import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Activation from "./pages/Activation"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from "./pages/Profile"
import Logout from "./pages/Logout"

function App() {
  const [userToken, setUserToken] = useState(null)


  return (
    <>
      <UserContext.Provider value={userToken}>
        <Router>
          <ToastContainer />
          <Navbar/>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="activation/:uid/:token" element={<Activation />}/>
            <Route path="profile" element={<Profile/>}/>
            <Route path="logout" element={<Logout/>}/>
          </Routes>
        </Router>
      </UserContext.Provider>
    </>
  )
}

export default App
