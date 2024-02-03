import axios from "axios";
import {API_URL} from "../../settings/config";
import {toast} from "react-toastify";

//funkcja odpowiedzialna za pobieranie listy zeskanowanej żywności po zakończeniu identyfikacji wideo.
//przyjmuje ustawienie torby oraz ustawienie wideo
export const updateFood = (setProductBackpack, setStreamCamera) => {
    axios.get(`${API_URL}/api/update_food_list`)
        .then((response) => {
            //w razie powodzenia wyświetl komunikat
            toast.success('nowe produkty w torbie z zakupami!');
            setProductBackpack(response.data);
        })
        .catch((error) => {
            setStreamCamera(null); // zmiana wideo na null
            //w razie niepowodzenia - komunikat i wyświetlamy error w konsoli
            toast.error('nie udało się załadować produktów do torby z zakupami!');
            console.error(`Error starting camera: ${error}`);

        });
};