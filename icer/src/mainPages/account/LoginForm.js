// LoginForm.js
import React, { useState } from 'react';
import './LoginForm.css';
import google from "../../data/google.png";
import facebook from "../../data/facebook.png";
import {Icon} from "@iconify/react";
import {Link} from "react-router-dom";
import logo from "../../data/logo.svg";
import {toast} from "react-toastify";

//formularz logowania
function LoginForm({ onLogin , onSwitchToRegister  }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // złożenie formularza wywołuje funkcję logowania
    const handleSubmit = event => {
        event.preventDefault();
        if (onLogin) {
            onLogin({ username, password });

        }

    };

    //formularz logowania
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

                <button type="submit" className="loginButton">Zaloguj</button>
                <button type="button" className="registerButton" onClick={onSwitchToRegister}>
                    Zarejestruj się
                </button>

                {/*<div className="loginTypes">*/}
                {/*    <button className="loginGoogle">*/}
                {/*        <img src={google} alt="googleLogo" className="googleLogo"/>*/}
                {/*    </button>*/}

                {/*    <button className="loginFacebook">*/}
                {/*        <img src={facebook} alt="facebookLogo" className="facebookLogo"/>*/}

                {/*    </button>*/}
                {/*</div>*/}
            </div>

        </form>
    );
}

export default LoginForm;
