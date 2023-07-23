import React, { useState } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';

function Login() {
    const [user, setUser] = useState(null);

    const handleLogin = async credentials => {
        try {
            const response = await axios.post('http://localhost:5000/login', credentials);

            setUser(response.data);
        } catch (error) {
            // Obsługa błędów logowania
            console.error("Error during login", error);
        }
    };

    return user ? <div>Welcome, {user.username}!</div> : <LoginForm onLogin={handleLogin} />;
}

export default Login;
