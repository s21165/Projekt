import axios from "axios";
import {API_URL} from "../../settings/config";
import {toast} from "react-toastify";
import {initializeProduct} from "../hooks/initializeProduct";

export const submitProduct = async (product, sessionId, image, setImage, setImagePreview, setRefresh, setProduct) => {
    try {
        const response = await axios.post(`${API_URL}/api/add_product`, product, {
            headers: {
                'Content-Type': 'application/json',
                'session_id': sessionId
            },
        });

        toast.success(`Produkt ${product.nazwa} został dodany!`);

        // Resetowanie stanu obrazu tylko po pomyślnym wysłaniu
        URL.revokeObjectURL(image);
        setImage(null);
        setImagePreview(null);
        setRefresh(prevRefresh => !prevRefresh); // Zmiana stanu refresh
        setProduct(initializeProduct); // Resetowanie formularza do wartości początkowych

    } catch (error) {
        console.error(`There was an error adding the product: ${error}`);
    }
};

