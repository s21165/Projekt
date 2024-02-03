// api.js
import axios from "axios";
import {API_URL} from "../../settings/config";
import {toast} from "react-toastify"; // Załóżmy, że plik znajduje się w odpowiednim miejscu

export const generateQRCode = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/generate_qr_code`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        // Możesz dostosować, co funkcja zwraca, na podstawie odpowiedzi od serwera
        return toast.success('kod został wygenerowany!'); // Załóżmy, że serwer zwraca URL do wygenerowanego kodu QR
    } catch (error) {
        toast.error('nie udało się wygenerować kodu!');
        console.error('Error generating QR code:', error);
        throw error; // Przekazanie błędu dalej, aby można było go obsłużyć w komponencie
    }
};
