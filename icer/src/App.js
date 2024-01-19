import './App.css';
import React, {useContext, useState} from "react";
import {AuthContext} from "./mainPages/account/auth-context";
import Main from "./Main";
import LoginForm from "./mainPages/account/LoginForm";
import RegisterForm from "./mainPages/account/RegisterForm";
import Login from "./mainPages/account/Login";
import {BrowserRouter as Router} from 'react-router-dom';
import axios from 'axios';
import {useEffect} from 'react';
import {ToastContainer} from "react-toastify";
import {SettingsProvider} from "./mainPages/SettingsContext";
import {Advert} from "./mainPages/Advert";

function App() {
    const {user} = useContext(AuthContext);
    const [adIsOn, setAdIsOn] = useState();

    return (
        <SettingsProvider>
            <Router>
                <ToastContainer/>

                {user ?(<Main/>) : <Login/>}
            </Router>
        </SettingsProvider>
    );
}

export default App;
