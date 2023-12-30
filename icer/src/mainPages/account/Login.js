import React, { useContext, useState } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';
import { AuthContext } from "./auth-context";
import RegisterForm from "./RegisterForm";
import {API_URL} from "../../config";
import { useNavigate } from 'react-router-dom';
import { useLogin } from './hooks/useLogin';
import useRegister from "./hooks/useRegister";
const backendUrl = 'http://localhost:5000';

function Login() {
    const authContext = useContext(AuthContext);
    const [mode, setMode] = useState('login');
    const handleLogin = useLogin();
    const handleRegister = useRegister();

    return authContext.user ? (
        <div>
            Witaj, {authContext.user.username}!
        </div>
    ) : (
        <div>
            {mode === 'login' ?
                <LoginForm onSwitchToRegister={() => setMode('register')} onLogin={handleLogin} />
                :
                <RegisterForm onSwitchToLogin={() => setMode('login')} onRegister={handleRegister} />
            }
        </div>
    );
}

export default Login;
