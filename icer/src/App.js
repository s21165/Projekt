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
import {SettingsProvider} from "./mainPages/settings/SettingsContext";
import {Advert} from "./mainPages/advert/Advert";

function App() {
    const { user } = useContext(AuthContext);

    const [adIsOn, setAdIsOn] = useState(true);

    useEffect(() => {
        if (user) {
            setAdIsOn(true);
        }
    }, [user]);

    return (
        <SettingsProvider>
            <Router>
                <ToastContainer/>

                {/*{user ?  <Main /> : <Login />}*/}
                {user ? (adIsOn ? <Advert adIsOn= {adIsOn} setAdIsOn={setAdIsOn} /> : <Main />) : <Login />}
            </Router>
        </SettingsProvider>
    );
}

export default App;
