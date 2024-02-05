import React, {useContext, useState} from 'react';
import LoginForm from './LoginForm';
import {AuthContext} from "./auth-context";
import RegisterForm from "./RegisterForm";
import {useLogin} from './hooks/useLogin';
import useRegister from "./hooks/useRegister";


//funkcja logowania
function Login() {
    //pobieramy informacje na temat aktualnego użytkownika
    const authContext = useContext(AuthContext);
    // zmienna określająca podstronę logowanie bądź rejestracja
    const [mode, setMode] = useState('login');
    const handleLogin = useLogin();
    const handleRegister = useRegister();

    //jeśli nie ma zalogowanego użytkownika to zwraca podstronę zależną od wartości mode
    return (!authContext.user &&
        <div>
            {mode === 'login' ?
                <LoginForm onSwitchToRegister={() => setMode('register')} onLogin={handleLogin}/>
                :
                <RegisterForm onSwitchToLogin={() => setMode('login')} onRegister={handleRegister}/>
            }
        </div>
    );
}

export default Login;
