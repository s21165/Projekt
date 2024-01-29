import React, { useState } from 'react';
import './LoginForm.css';
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";

function RegisterForm({ onRegister, onSwitchToLogin  }) {

    //inicjalizacja zmiennych przetrzymujących nazwę oraz hasło
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // złożenie formularza wywołuje funkcję rejestracji oraz zmianę podstrony na ekran logowania
    const handleSubmit = event => {
        event.preventDefault();

        onRegister({ username, password });
        onSwitchToLogin();

    };

    //formularz rejestracji
    return (
        <form onSubmit={handleSubmit} className="loginFormAll">

    <div className="loginFormBox">
            <input className="username"
                   type="text"
                   value={username}
                   onChange={e => setUsername(e.target.value)}
                   placeholder="Username"
            />
            <input className="password"
                   type="password"
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   placeholder="Password"
            />


            <button type="submit" className="registerButton" >Zarejestruj</button>
            <button type="button" className="loginButton" onClick={onSwitchToLogin}>
                Wróć do logowania
            </button>
    </div>
        </form>
    );
}

export default RegisterForm;
