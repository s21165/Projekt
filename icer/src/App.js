import './App.css';
import React, {useContext, useState} from "react";
import {AuthContext} from "./mainPages/account/auth-context";
import Main from "./Main";
import LoginForm from "./mainPages/account/LoginForm";
import RegisterForm from "./mainPages/account/RegisterForm";
import Login from "./mainPages/account/Login";
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import {ToastContainer} from "react-toastify";

function App() {
    const {user} = useContext(AuthContext);



    return(
        <Router>
            <ToastContainer />
            {user ? <Main /> : <Login />}
        </Router>
    );
}

export default App;
