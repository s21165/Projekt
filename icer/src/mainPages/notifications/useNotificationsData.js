import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { API_URL } from "../settings/config";
import {AuthContext} from "../account/auth-context";

//funkcja odpowiedzialna za pobieranie danych o powiadomieniach z api
export const useNotificationsData = () => {
    //pobieramy informacje na temat użytkownika w celu weryfikacji czy powinien on dostać dane, których żąda.
    const { user } = useContext(AuthContext);
    //przypisujemy kod sesji do zmiennej
    const sessionId = user ? user.sessionId : null;
    // zmienna z danymi powiadomień
    const [data, setData] = useState(null);
    //zmienna odpowiedzialna za odświeżanie w ramach potrzeby
    const [refresh, setRefresh] = useState(false);

    //podczas wywołania pobiera informacje z api
    useEffect(() => {
        axios.post(`${API_URL}/api/Icer/get_notifications`, {sessionId})
            .then((response) => {

                //przypisuje dane do zmiennej a następnie odświeża
                const newData = response.data;
                setData(newData);
                setRefresh(!refresh);

            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    }, [data, refresh]);// jeśli jakaś z tych wartości ulegnie zmianie to nastąpi ponowne pobieranie

    // zwracam wartości potrzebne do kontrolowania danych związanych z powiadomieniami w innych funkcjach
    return { data, setData, sessionId, refresh, setRefresh };
};
