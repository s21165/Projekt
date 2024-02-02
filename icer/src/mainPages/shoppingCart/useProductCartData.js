import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "../settings/config";
import {AuthContext} from "../account/auth-context";

//funkcja odpowiedzialna za pobieranie danych o liście zakupów z api
export const useProductCartData = () =>{
    //pobieram użytkownika w ramach autoryzacji
    const { user } = useContext(AuthContext);

    //ustawiam sesja z informacji o użytkowniku w ramach autoryzacji
    const sessionId = user ? user.sessionId : null;

    // zmienna do przechowywania danych
    const [data, setData] = useState(null);

useEffect(() => {
    //wysyła żądanie do api wraz z zamieszczeniem id sesji do autoryzacji
    axios.post(`${API_URL}/api/shoppingList`,{sessionId:sessionId} )
        .then((response) => {
            //w razie powodzenia zapisz dane w data
            setData(response.data);

        })
        .catch((error) => {
            //w razie niepowodzenia wyświetl error z serwera w konsoli
            console.error(`There was an error retrieving the data: ${error}`);
        });
}, [data]);// odśwież kiedy zmienią się dane

    //zwróć dane, możliwość ich ustawienia, użytkownika i sesję.
    return{ data, setData,user, sessionId}
}