// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';

const backendUrl = 'http://localhost:5000'; // Dodaj backendUrl

function Login() {
    const [user, setUser] = useState(null);

    // Funkcja do wysłania danych logowania (POST)
    const handlePostLogin = async credentials => {
        try {
            const response = await axios.post(`${backendUrl}/login`, credentials); // Dodaj backendUrl przed /login

            setUser(response.data);
        } catch (error) {
            // Obsługa błędów żądania POST
            console.error("Error during POST login", error);
        }
    };

    return user ? (
        <div>
            Welcome, {user.username}!
        </div>
    ) : (
        <div>
            <LoginForm onLogin={handlePostLogin} />
        </div>
    );
}

export default Login;
