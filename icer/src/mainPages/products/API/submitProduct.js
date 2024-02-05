import axios from "axios";
import {API_URL} from "../../settings/config";
import {toast} from "react-toastify";
import {initializeProduct} from "../hooks/initializeProduct";


//funkcja do komunikacji z API odnośnie wysłania produktu. Przyjmuje: produkt, id sesji użytkownika, obrazek, ustawienie obrazka
// podgląd obrazka, ustawienie podglądu obrazka, ustawienie odświeżenia po dodaniu, ustawienie produktu.
export const submitProduct = async (product, sessionId, image, setImage, setImagePreview, setRefresh, setProduct) => {
    try {
        const response = await axios.post(`${API_URL}/api/add_product`, product, {
            headers: {
                'Content-Type': 'application/json', //wskazuje w jakim typie będą dane
                'session_id': sessionId
            },
        });
        // w razie sukcesu pokaż komunikat
        toast.success(`Produkt ${product.nazwa} został dodany!`);
        URL.revokeObjectURL(image); // zwalniamy stan podglądu obrazu tylko po pomyślnym wysłaniu
        setImage(null); //ustawiamy obrazek na null
        setImagePreview(null); //ustawiamy podgląd obrazka na null
        setRefresh(prevRefresh => !prevRefresh); // Zmiana stanu refresh
        setProduct(initializeProduct); // Resetowanie formularza do wartości początkowych

    } catch (error) {
        // w razie niepowodzenia komunikat oraz wyświetlamy error z serwera w konsoli
        toast.error(`nie udało się dodać produktu ${product.nazwa}!`);
        console.error(`There was an error adding the product: ${error}`);
    }
};

