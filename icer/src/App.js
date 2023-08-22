import './App.css';
import React, {useContext, useState} from "react";
import {AuthContext} from "./mainPages/auth-context";
import Main from "./Main";
import LoginForm from "./mainPages/LoginForm";
import RegisterForm from "./mainPages/RegisterForm";
import Login from "./mainPages/Login";

function App() {
    const {user} = useContext(AuthContext);


    return(
        <>
            {user ? <Main /> : <Login />}
        </>
    );
}

export default App;
