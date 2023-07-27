// Login.js
import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';
import {AuthContext} from "./auth-context";

const backendUrl = 'http://localhost:5000'; // Dodaj backendUrl

function Login() {
    const { login } = useContext(AuthContext);

    // useEffect(() => {
    //     const user = JSON.parse(localStorage.getItem('user'));
    //     if (user) {
    //         setUser(user);
    //     }
    // }, []);

    // Funkcja do wysłania danych logowania (POST)
    const handlePostLogin = async (credentials) => {
        try {
            const response = await axios.post(`${backendUrl}/login`, credentials);
            const { data } = response;
            if (data) {
                login(data);
            }
        } catch (error) {
            console.error('Error during POST login', error);
        }
    };



    return login.user ? (
        <div>
            Welcome, {login.username}!

        </div>
    ) : (
        <div>
            <LoginForm onLogin={handlePostLogin} />
        </div>
    );
}

export default Login;