import axios from 'axios';
import { API_URL } from "../../settings/config";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//funkcja odpowiedzialna za wysyłanie danych do api w celu wykonania akcji na produktach
//przyjmuje: odświeżenie, dane, id sesji użytkownika, ustawienie danych, ustawienie odświeżenia, produkt do edycji,ustawienie produktu do edycji
export const useProductActions = (refresh,data,sessionId, setData, setRefresh,editingProduct,setEditingProduct) => {

    //zwiększenie ilości produktu o 1
    const handleIncrease = (productId) => {

        axios.post(`${API_URL}/api/add_to_product`,
            {sessionId:sessionId,
                id_produktu: productId
            } )
            .then((response) => {
                //ustaw dane na zaktualizowane dane
                setData(response.data);
                //wykonaj odświeżenie komponentów
                setRefresh(!refresh);
                // w razie powodzenia wyświetl komunikat
                toast.success(`dodano jeden produkt!` )
            })
            .catch((error) => {
                //w razie niepowodzenia - komunikat i wyświetlamy error w konsoli
                toast.error('nie udało się dodać ilości!');
                console.error(`There was an error retrieving the data: ${error}`);
            });
    };
    //po zdecydowaniu się na edycję porduktu wypełnij pola formularza przyjmowanym produktem, który jest edytowany
    const handleEditClick = (product) => {
        console.log(product)
        setEditingProduct({
            id: product.produktID,
            nazwa: product.nazwa,
            cena: product.cena,
            kalorie: product.kalorie,
            tluszcze: product.tluszcze,
            weglowodany: product.weglowodany,
            bialko: product.bialko,
            kategoria: product.kategoria,
            ilosc: product.ilosc,
            data_waznosci: new Date(product.data_waznosci).toISOString().split('T')[0]
        });
    };

    //wysyłanie edytowanego produktu do api, przyjmuje edytowany produkt
    const handleEdit = (edProduct) => {
        const id = editingProduct.id;
        const config = {
            headers: {
                'Content-Type': 'application/json', // informuje serwer, że dane wysyłane w żądaniu są w formacie JSON.
                'session_id': sessionId,
            },
        };
        axios
            .put(`${API_URL}/api/edit_product/${id}`, edProduct, config)
            .then((response) => {
                //w razie powodzenia ustaw edytowany produkt na null i odśwież oraz wyświetl komunikat
                setEditingProduct(null);
                setRefresh(!refresh);
                toast.success(`produkt ${edProduct.nazwa} został edytowany!`);
            })
            .catch((error) => {
                //w razie niepowodzenia - komunikat i wyświetlamy error w konsoli
                toast.error(`nie udało się edytować produktu ${edProduct.nazwa}!`);
                console.error(`There was an error updating the product: ${error}`);
            });
    };
    // zmniejszanie ilości produktu o podanym id
    const handleDecrease = (productId) => {

        axios.post(`${API_URL}/api/subtract_product`,
            {sessionId:sessionId,
                id_produktu: productId
            } )
            .then((response) => {
                //ustaw dane na zaktualizowane dane
                setData(response.data);
                //odśwież komponenety
                setRefresh(!refresh);
                //w razie powodzenia - komunikat
                toast.success('odjęto jeden produkt!');

            })
            .catch((error) => {
                //w razie niepowodzenia - komunikat i wyświetlamy error w konsoli
                toast.error('nie udało się odjąć produktu!');
                console.error(`There was an error retrieving the data: ${error}`);
            });
    };

    // zerowanie ilości produktu o podanym id
    const handleZero = (productId) => {

        axios.post(`${API_URL}/api/reset_product_quantity`,
            {sessionId:sessionId,
                id_produktu: productId
            } )
            .then((response) => {
                setData(response.data);//ustawienie danych na aktualne
                //w razie powodzenia - komunikat( produkty z zerową ilością są w liście wyczerpanych produktów)
                toast.success(`Produkt został przeniesiony do listy produktów wyczepranych!`);
                //odśwież komponenty
                setRefresh(!refresh);
            })
            .catch((error) => {
                //w razie niepowodzenia - komunikat i wyświetlamy error w konsoli
                toast.error('nie udało się przeniesiony produktu do listy produktów wyczepranych!');
                console.error(`There was an error retrieving the data: ${error}`);
            });
    };

    //usunięcie produktu o podanym id z listy produktów
    const handleRemove = (productId) => {

        axios
            .post(`${API_URL}/remove_product_for_user`,{
                SessionId: sessionId,
                produktID:productId
            },)
            .then((response) => {
                //w razie powodzenia - komunikat
                toast.success(`Produkt został usunięty!`);
                setRefresh(!refresh); // odśwież komponenty
            })
            .catch((error) => {
                //w razie niepowodzenia - komunikat i wyświetlamy error w konsoli
                console.error(`There was an error removing the product: ${error}`);
                toast.error(`Nie udało się usunąć produktu !`)
            });
    };

            //zwraca funkcje opisane wyżej
    return { handleIncrease, handleDecrease, handleZero, handleRemove, handleEdit, handleEditClick };
};