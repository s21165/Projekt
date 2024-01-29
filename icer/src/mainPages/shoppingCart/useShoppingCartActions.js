import axios from 'axios';
import { API_URL } from "../settings/config";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useContext} from "react";
import {AuthContext} from "../account/auth-context";


export const useShoppingCartActions = ()=>{
    const { user } = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;
    const removeFromCart = (id) => {
        console.log('poszlo delete')
        // Znajdź produkt o danym ID i zwiększ jego ilość
        axios.post(`${API_URL}/api/edit_shopping_cart`,
            {sessionId:sessionId,
                productID: id,
                inCart:0
            } )
            .then((response) => {

                toast.success(`Produkt został usunięty z listy zakupów!`);


            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    };

    const addToCart = (newFields) => {
        // Znajdź produkt o danym ID i zwiększ jego ilość
        console.log('poszlo add')
        axios.post(`${API_URL}/api/edit_shopping_cart`,
            {sessionId:sessionId,
                nazwa:newFields.nazwa,
                cena:newFields.cena,
                ilosc:newFields.ilosc,
                inCart:1
            } )
            .then((response) => {

                toast.success(`Produkt ${newFields.nazwa} został dodany do listy zakupów!`);


            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    };
    const addToCartFromProducts = (id) => {
        // Znajdź produkt o danym ID i zwiększ jego ilość
        console.log('poszlo add')
        axios.post(`${API_URL}/api/edit_shopping_cart`,
            {sessionId:sessionId,
                productID: id,
                inCart:1
            } )
            .then((response) => {

                toast.success(`Produkt został dodany do listy zakupów!`);


            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    };


    return {removeFromCart, addToCart,addToCartFromProducts};
};
