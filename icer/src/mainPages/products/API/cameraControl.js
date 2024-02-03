import axios from "axios";
import {API_URL} from "../../settings/config";
import {toast} from "react-toastify";

//funkcja do komunikacji z API odnośnie rozpoczęcia identyfikacji wideo, przyjmuje ustawienie
//zmiennej do wideo
export const cameraControl = (setStreamCamera) => {

    axios.post(`${API_URL}/start_camera`)
        .then((response) => {
            //w razie powodzenia - komunikat
            toast.success('identyfikacja rozpoczęta!');
            //ustawia wideo do zmiennej streamCamera. Do url dodałem znak czasu co pozwala na ponowne
            //użycie funkcji bez potrzeby odświeżania strony po jej wyłączeniu
            setStreamCamera(`${API_URL}/stream_camera?timestamp=${Date.now()}`);
        })
        .catch((error) => {
            //w razie niepowodzenia ustawiamy wideo na pustą wartość
            setStreamCamera(null);
            //dajemy komunikat i wyświetlamy error w konsoli
            toast.error('identyfikacja nieudana!');
            console.error(`Error starting camera: ${error}`);
        });
};
