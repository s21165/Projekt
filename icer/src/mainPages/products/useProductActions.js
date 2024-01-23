import axios from 'axios';
import { API_URL } from "../../config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const useProductActions = (refresh,data,sessionId, setData, setRefresh,editingProduct,setEditingProduct) => {
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
    const handleEditClick = (product) => {
        console.log(product)
        setEditingProduct({
            id: product.id,
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

    const handleEdit = (edProduct) => {
        const id = editingProduct.id;
        const config = {
            headers: {
                'Content-Type': 'application/json', // informuje serwer, że dane wysyłane w żądaniu są w formacie JSON.
                'session_id': sessionId

            },
        };
        console.log("wysylam:"+ edProduct.nazwa);
        axios
            .put(`${API_URL}/api/edit_product/${id}`, edProduct, config)
            .then((response) => {

                setEditingProduct(null);
                setRefresh(!refresh);
            })
            .catch((error) => {
                console.error(`There was an error updating the product: ${error}`);
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
                toast.success(`Produkt ${data.nazwa} został przeniesiony do kosza!`);
                setRefresh(!refresh);

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
                toast.success(`Produkt ${data.nazwa} został usunięty!`);
                setRefresh(!refresh); // Refresh the product list after deletion

            })
            .catch((error) => {
                console.error(`There was an error removing the product: ${error}`);
                toast.error(`Nie udało się usunąć produktu ${data.nazwa}!`)
            });
    };


    return { handleIncrease, handleDecrease, handleZero, handleRemove, handleEdit, handleEditClick };
};
