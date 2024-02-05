import axios from 'axios';
import { API_URL } from "../settings/config";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useContext} from "react";
import {AuthContext} from "../account/auth-context";

//funkcja odpowiedzialna za łączenie się z api w celu wykonywania akcji na liście zakupów
export const useShoppingCartActions = ()=>{

    //pobieram użytkownika w ramach autoryzacji
    const { user } = useContext(AuthContext);

    //ustawiam sesja z informacji o użytkowniku w ramach autoryzacji
    const sessionId = user ? user.sessionId : null;

    // funkcja do usuwania pojedynczego elementu listy
    const removeFromCart = (id) => {

        axios.post(`${API_URL}/api/edit_shopping_cart`,
            //przekazywane wartości do API
            {sessionId:sessionId,
                productID: id,
                inCart:0
            } )
            .then((response) => {
                //w razie powodzenia wyświetl komunikat
                toast.success(`Produkt został usunięty z listy zakupów!`);


            })
            .catch((error) => {
                //w razie niepowodzenia wyświetl error z serwera w konsoli oraz wyświetl komunikat
                console.error(`There was an error retrieving the data: ${error}`);
                toast.error(`nie udało się usunąć produktu z listy zakupów!`);
            });
    };

    //usuń wszystkie elementy z listy zakupów
    const removeAllFromCart = () => {

        axios.post(`${API_URL}/api/edit_shopping_cart`,
            //wysyłane wartości
            {sessionId:sessionId,
                inCart:0
            } )
            .then((response) => {
                //w razie powodzenia wyświetl komunikat
                toast.success(`Wszystkie produkty zostały usunięte z listy zakupów!`);


            })
            .catch((error) => {
                //w razie niepowodzenia wyświetl error z serwera w konsoli oraz wyświetl komunikat
                console.error(`There was an error retrieving the data: ${error}`);
                toast.error(`nie udało się usunąć wszystkich produktów z listy zakupów!`);

            });
    };

    //ręczne dodawanie do listy zakupów
    const addToCart = (newFields) => {

        axios.post(`${API_URL}/api/edit_shopping_cart`,
            //wysyłane wartości
            {sessionId:sessionId,
                nazwa:newFields.nazwa,
                cena:newFields.cena,
                ilosc:newFields.ilosc,
                inCart:1
            } )
            .then((response) => {
                //w razie powodzenia wyświetl komunikat
                toast.success(`Produkt ${newFields.nazwa} został dodany do listy zakupów!`);


            })
            .catch((error) => {
                //w razie niepowodzenia wyświetl error z serwera w konsoli oraz wyświetl komunikat
                console.error(`There was an error retrieving the data: ${error}`);
                toast.error(`nie udało się dodać produktu do listy zakupów!`);

            });
    };

    //dodawanie produktu do listy zakupów
    const addToCartFromProducts = (id) => {

        axios.post(`${API_URL}/api/edit_shopping_cart`,
            //wysyłane wartości
            {sessionId:sessionId,
                productID: id,
                inCart:1,
                ilosc:1
            } )
            .then((response) => {
                //w razie powodzenia wyświetl komunikat
                toast.success(`Produkt został dodany do listy zakupów!`);


            })
            .catch((error) => {
                //w razie niepowodzenia wyświetl error z serwera w konsoli oraz wyświetl komunikat
                console.error(`There was an error retrieving the data: ${error}`);
                toast.error(`nie udało się dodać produktu do listy zakupów!`);
            });
    };

    //zwracamy powyższe funkcje
    return {removeFromCart, addToCart,addToCartFromProducts,removeAllFromCart};
};
