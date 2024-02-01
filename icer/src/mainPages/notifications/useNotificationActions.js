import axios from 'axios';
import { API_URL } from "../settings/config";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//funkcja odpowiedzialna za łączenie się z api w celu wykonywania akcji na powiadomieniach
//przyjmuje takie wartości jak: data - dane, setData - ustawia dane, id sesji, refresh - wartość, która odpowiada za odświeżanie
//oraz setRefresh - czyli funkcja wykonująca zmianę stanu refresh
export const useNotificationActions = (data,setData,sessionId,refresh,setRefresh) => {



    //odczytuje wszystkie powiadomienia
    const handleReadAllNotifications = () => {

        axios
            .post(`${API_URL}/api/Icer/delete_all_notification`,{
                sessionId: sessionId,
                notificationValue:0 // przekazuje wartość, która jest decyzyjna w tym co zrobić
            },)
            .then((response) => {
                toast.success(`Wszystkie powiadomienia zostały odczytane!`);
                setRefresh(!refresh); // odświeża po odczytaniu

            })
            .catch((error) => {
                console.error(`There was an error removing all notifications: ${error}`);
                toast.error(`Nie udało się odczytać wszystkich powiadomień!`)
            });
    };

    //odczytuje wybrane powiadomienie
    const handleReadNotification = (notificationId) => {

        axios
            .post(`${API_URL}/api/Icer/delete_notification`,{
                sessionId: sessionId,
                notificationId:notificationId, //przekazuje z jakim produktem mamy do czynienia
                notificationValue:0 // przekazuje wartość, która jest decyzyjna w tym co zrobić
            },)
            .then((response) => {
                toast.success(`Powiadomienie zostało odczytane!`);//komunikat w razie powodzenia
                setRefresh(!refresh); // odświeża po odczytaniu

            })
            .catch((error) => {
                console.error(`There was an error removing the product: ${error}`);//wyświetla error przekazany z serwera w konsoli
                toast.error(`Nie udało się odczytać powiadomienia!`)//komunikat w razie niepowodzenia
            });
    };


    //usuwa wszystkie powiadomienia
    const handleRemoveAllNotifications = () => {

        axios
            .post(`${API_URL}/api/Icer/delete_all_notification`,{
                sessionId: sessionId,
                notificationValue:null  // przekazuje wartość, która jest decyzyjna w tym co zrobić
            },)
            .then((response) => {
                toast.success(`Wszystkie powiadomienia zostały usunięte!`);// komunikat w razie powodzenia
                setRefresh(!refresh); // odświeża po odczytaniu

            })
            .catch((error) => {
                console.error(`There was an error removing all notifications: ${error}`);// wyświetla error przekazany z serwera w konsoli
                toast.error(`Nie udało się usunąć wszystkich powiadomień!`) // komunikat w razie niepowodzenia
            });
    };

    //usuwa wybrane powiadomienie
    const handleRemoveNotification = (notificationId) => {

        axios
            .post(`${API_URL}/api/Icer/delete_notification`,{
                sessionId: sessionId,
                notificationId:notificationId, //przekazuje z jakim powiadomieniem mamy do czynienia
                notificationValue:null // przekazuje wartość, która jest decyzyjna w tym co zrobić
            },)
            .then((response) => {

                toast.success(`Powiadomienie zostało usunięte!`); // komunikat w razie powodzenia
                setRefresh(!refresh); // odświeża po odczytaniu

            })
            .catch((error) => {
                console.error(`There was an error removing the product: ${error}`); // wyświetla error przekazany z serwera w konsoli
                toast.error(`Nie udało się usunąć powiadomienia!`) // komunikat w razie niepowodzenia
            });
    };

    // zwraca wyżej opisane funkcje
    return { handleRemoveAllNotifications, handleRemoveNotification, handleReadNotification, handleReadAllNotifications};
};
