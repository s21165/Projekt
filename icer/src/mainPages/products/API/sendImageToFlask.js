import axios from "axios";
import {API_URL} from "../../settings/config";
import {toast} from "react-toastify";

//funkcja do komunikacji z API w celu identyfikacji obrazu z jedzeniem, przyjmuje plik i ustawienie
// podglądu zdjęcia
export const sendImageToFlask = async (file,setImageForIdentyficationURL) => {
    //tworzy zmienną formData i dodaje do niej plik
    const formData = new FormData();
    formData.append('file', file);

    try {//wysyła plik
        const response = await axios.post(`${API_URL}/upload_image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' //wskazuje w jakim typie będą dane
            }
        });
        setImageForIdentyficationURL(null) // wyłącza podgląd


    } catch (error) {
        //w razie niepowodzenia komunikat oraz error z serwera w konsoli
        toast.error("nie udało się wysłać zdjęcia do identyfikacji!")
        console.error('Error:', error);
    }
};
