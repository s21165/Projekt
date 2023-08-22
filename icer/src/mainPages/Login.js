// Login.js
import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';
import {AuthContext} from "./auth-context";
import RegisterForm from "./RegisterForm";

const backendUrl = 'http://localhost:5000'; // Dodaj backendUrl

function Login() {
    const { login } = useContext(AuthContext);
    const [mode, setMode] = useState('login');
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

    const handlePostRegister = async (data) => {
        try {
            await axios.post(`${backendUrl}/register`, data);

        } catch (error) {
            console.error('Error during POST register', error);
        }
    };


    return login.user ? (
        <div>
            Witaj, {login.username}!

        </div>
    ) : (
        <div>
            {mode === 'login' ?
            <LoginForm onSwitchToRegister={() => setMode('register')} onLogin={handlePostLogin} />
            :
            <RegisterForm onSwitchToLogin={() => setMode('login')} onRegister={handlePostRegister} />
            }
        </div>
    );
}

export default Login;