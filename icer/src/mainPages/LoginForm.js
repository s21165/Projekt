import React, { useState } from 'react';
import './LoginForm.css';
import google from "../data/google.png";
import facebook from "../data/facebook.png";
function LoginForm({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = event => {
        event.preventDefault();
        onLogin({ username, password });
    };

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
                <button type="submit" className="loginButton">Login</button>
                <div className="loginTypes">
                    <button className="loginGoogle">
                        <img src={google} alt="googleLogo" className="googleLogo"/>
                    </button>

                    <button className="loginFacebook">
                        <img src={facebook} alt="facebookLogo" className="facebookLogo"/>

                    </button>
                </div>
            </div>

        </form>
    );
}

export default LoginForm;
