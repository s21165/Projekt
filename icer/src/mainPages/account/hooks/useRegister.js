import axios from 'axios';
import { API_URL } from "../../settings/config";
import {toast} from "react-toastify";

const useRegister = () => {
    const handlePostRegister = async (data) => {
        try {
            toast.success(`Zarejestrowano!`);
            await axios.post(`${API_URL}/register`, data);

            // Możesz również dodać automatyczne logowanie po udanej rejestracji lub komunikat o sukcesie
        } catch (error) {
            console.error('Error during POST register', error);
        }
    };

    return handlePostRegister;
};

export default useRegister;