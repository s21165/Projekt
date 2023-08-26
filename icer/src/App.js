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

    useEffect(() => {

            // Jeśli użytkownik jest zalogowany, wywołaj funkcję start_camera_monitoring_route
            axios.post('/start_camera_monitoring')
                .then((response) => {
                    console.log('Kamera rozpoczęła monitoring');
                })
                .catch((error) => {
                    console.error(`Wystąpił błąd podczas rozpoczynania monitoringu kamery: ${error}`);
                });

    }, [user]);

    return(
        <>
            {user ? <Main /> : <Login />}
        </>
    );
}

export default App;
