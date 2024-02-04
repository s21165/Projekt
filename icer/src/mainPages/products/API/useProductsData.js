import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { API_URL } from "../../settings/config";
import {AuthContext} from "../../account/auth-context";
import {toast} from "react-toastify";

//funkcja odpowiedzialna za pobieranie produktów z API, przyjmuje filter, który określa czy produkt ma ilość 0 czy większą

export const useProductsData = ( filter) => {

    //przyjmuje użytkownika w ramach weryfikacji
    const { user } = useContext(AuthContext);

    //wydzielamy id sesji z informacji o użytkowniku
    const sessionId = user ? user.sessionId : null;
    //zmienna przechowująca dane
    const [data, setData] = useState(null);
    //zmienna przechowująca filtrowane dane
    const [filteredProducts, setFilteredProducts] = useState(null);
    //odświeżenie, ponowne pobieranie
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        axios.post(`${API_URL}/api/Icer`, {sessionId})
            .then((response) => {
                //przypisujemy pobrane dane do zmiennej potem z tej zmiennej zapisujemy je do głównej zmiennej danych,
                //takie zastosowanie wyeliminowało problem z errorami przy pobieraniu
                const newData = response.data;
                setData(newData);
                //zmienna przechowująca przefiltrowane dane względem wartości filter
                const newFilteredProducts = newData.filter(product => {
                    if (filter === 'current') {
                        return product.ilosc > 0;
                    } else if (filter === 'old') {
                        return product.ilosc === 0;
                    }
                    return true;
                });
                //zapisuje przefitrowane dane do filtrowanych danych
                setFilteredProducts(newFilteredProducts);
                
            })
            .catch((error) => {

                console.error(`There was an error retrieving the data: ${error}`);
            });
    }, [data,refresh, filter, sessionId]);//odśwież po zmianie tych wartości
            //zwróć te wartości
    return { data, setData, sessionId, filteredProducts, refresh, setRefresh };
};


