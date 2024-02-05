import axios from "axios";
import {API_URL} from "../../settings/config";
import {toast} from "react-toastify";

//funkcja do komunikacji z API odnośnie zakończenia identyfikacji wideo, przyjmuje funkcję
//odbioru zeskanowanych danych, torbę, ustawienie wideo, ustawienie torby
export const stopCamera = ({updateFood},productBackpack,setStreamCamera,setProductBackpack,sessionId) => {
    axios.post(`${API_URL}/stop_camera`)
        .then((response) => {
            setStreamCamera(null); // ustawia wideo na null
            updateFood(setProductBackpack, setStreamCamera,sessionId)//wywołanie funkcji do pobrania zeskanowanych produktów
            //komunkat w razie sukcesu
            toast.success('kamera została zatrzymana!');

        })
        .catch((error) => {
            // w razie nie powodzenia komunikat oraz error z serwera w konsoli
            toast.success('nie udało sie poprawnie zatrzymać kamery!');
            console.error(`Error stopping camera: ${error}`);
            setProductBackpack(''); // zmiana torby z zakupami na pusty ciąg znaków
            setStreamCamera(null);// zmiana wideo na null
        });

};
