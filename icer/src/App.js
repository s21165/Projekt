import './App.css';
import React, {useContext, useState} from "react";
import {AuthContext} from "./mainPages/account/auth-context";
import Main from "./Main";
import LoginForm from "./mainPages/account/LoginForm";
import RegisterForm from "./mainPages/account/RegisterForm";
import Login from "./mainPages/account/Login";

import axios from 'axios';
import { useEffect } from 'react';

function App() {
    const {user} = useContext(AuthContext);



    return(
        <>
            {user ? <Main /> : <Login />}
        </>
    );
}

export default App;
