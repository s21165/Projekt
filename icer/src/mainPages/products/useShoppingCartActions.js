import axios from 'axios';
import { API_URL } from "../../config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const useShoppingCartActions = (data, setData,sessionId)=>{

    const removeFromCart = (id) => {
        console.log('poszlo delete')
        // Znajdź produkt o danym ID i zwiększ jego ilość
        axios.post(`${API_URL}/api/add_to_shopping_cart`,
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
        axios.post(`${API_URL}/api/add_to_shopping_cart`,
            {sessionId:sessionId,
                nazwa:newFields.nazwa,
                cena:newFields.cena,
                ilosc:newFields.ilosc,
                inCart:1
            } )
            .then((response) => {
                setData(response.data);
                toast.success(`Produkt ${newFields.nazwa} został dodany do listy zakupów!`);


            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    };


    return {removeFromCart, addToCart};
};
