// hook używany do logowania
import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {AuthContext} from "../auth-context";
import {API_URL} from "../../settings/config";
import {toast} from "react-toastify";

export const useLogin = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            const {data} = response;
            if (data && data.session_id) {
                authContext.login({
                    username: credentials.username,
                    sessionId: data.session_id
                });
                navigate('/');
                toast.success(`Zalogowano!`);
            }
        } catch (error) {
            console.error('Error during POST login', error);
        }
    };

    return handleLogin;
};
