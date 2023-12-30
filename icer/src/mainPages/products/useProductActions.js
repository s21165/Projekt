import axios from 'axios';
import { API_URL } from "../../config";

export const useProductActions = (refresh,data,sessionId, setData, setRefresh) => {
    const handleIncrease = (productId) => {
        // logika zwiększania ilości produktu
        axios.post(`${API_URL}/api/add_to_product`,
            {sessionId:sessionId,
                id_produktu: productId
            } )
            .then((response) => {
                setData(response.data);
                setRefresh(!refresh);
                console.log("dodano 1 do produktu: " + data.nazwa)
            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    };

    const handleDecrease = (productId) => {
        // Znajdź produkt o danym ID i zmniejsz jego ilość
        axios.post(`${API_URL}/api/subtract_product`,
            {sessionId:sessionId,
                id_produktu: productId
            } )
            .then((response) => {
                setData(response.data);
                console.log("odjęto produkt: " + data.nazwa)
                setRefresh(!refresh);
            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    };


    const handleZero = (productId) => {
        // Znajdź produkt o danym ID i zwiększ jego ilość
        axios.post(`${API_URL}/api/reset_product_quantity`,
            {sessionId:sessionId,
                id_produktu: productId
            } )
            .then((response) => {
                setData(response.data);
                setRefresh(!refresh);
                console.log("zerowanie : " + data.nazwa)
            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    };

    const handleRemove = (productId) => {

        axios
            .post(`${API_URL}/remove_product_for_user`,{
                SessionId: sessionId,
                produktID:productId
            },)
            .then((response) => {
                console.log(response.data);
                setRefresh(!refresh); // Refresh the product list after deletion
            })
            .catch((error) => {
                console.error(`There was an error removing the product: ${error}`);
            });
    };


    return { handleIncrease, handleDecrease, handleZero, handleRemove };
};
