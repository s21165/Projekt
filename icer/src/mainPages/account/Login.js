import React, { useContext, useState } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';
import { AuthContext } from "./auth-context";
import RegisterForm from "./RegisterForm";
import {API_URL} from "../../config";

const backendUrl = 'http://localhost:5000';

function Login() {
    const authContext = useContext(AuthContext);
    const [mode, setMode] = useState('login');

    const handlePostLogin = async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            const { data } = response;
            if (data && data.session_id) {
                // Aktualizacja kontekstu z danymi użytkownika i sessionId
                authContext.login({
                    username: credentials.username,
                    sessionId: data.session_id
                });
            }
        } catch (error) {
            console.error('Error during POST login', error);
        }
    };

    const handlePostRegister = async (data) => {
        try {
            await axios.post(`${API_URL}/register`, data);
            // Możesz również dodać automatyczne logowanie po udanej rejestracji lub komunikat o sukcesie
        } catch (error) {
            console.error('Error during POST register', error);
        }
    };

    return authContext.user ? (
        <div>
            Witaj, {authContext.user.username}!
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
