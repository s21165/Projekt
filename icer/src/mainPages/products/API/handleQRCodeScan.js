import axios from "axios";
import {API_URL} from "../../settings/config";
import {toast} from "react-toastify";

//funkcja, która dekoduje kod QR, przekazuje do niej obrazek z kodem QR, ustawienie produktu, ustawienie obrazka z kodem qr,
// ustawienie podglądu obrazka z kodem qr,
export const handleQRCodeScan = async (
    qrImage,
    setProduct,
    setQrImage,
    setQrImagePreview

) => {
    if(!qrImage) return;//jeśli nie ma kodu qr to zakończ

    const formData = new FormData(); //nowy obiekt form data
        formData.append('qr_code_image', qrImage);//dodaje do niego obrazek pod nazwą 'qr_code_image'

        try {//wysyłam obrazek w żądaniu post
            const response = await axios.post(`${API_URL}/decode_qr_code`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                //w razie powodzenia:
                // zwrócone dane muszę przerobić aby były odpowiedno wyświetlane. Dodaję split, który
                //jest wyznacznikiem oddzielonych wartości
                const keyValuePairs = response.data.split(',');
                //tworze obiekty z par
                const parsedData = keyValuePairs.reduce((obj, pair) => {
                    const [key, value] = pair.split(':');
                    obj[key.trim()] = value.trim(); //usuwanie bialych znaków między wartościami
                    return obj;
                }, {});
                //wskazuje na jakim znaku rozpoczyna się nazwa, do przecinka
                const endIndex = response.data.indexOf(',', 28);

                //ustawiam produkt
                setProduct(() => ({

                    nazwa: response.data.substring(28, endIndex),
                    cena: parsedData.Price,
                    kalorie: parsedData.Kcal,
                    tluszcze: parsedData.Fat,
                    weglowodany: parsedData.Carbs,
                    bialko: parsedData.Protein,
                    kategoria: parsedData.Category,
                    ilosc: parsedData.Amount,
                    data_waznosci: new Date().toISOString().split('T')[0],
                }));

                //ustawia obrazek i podgląd na pusty ciąg znaków
                setQrImage('');
                setQrImagePreview('');
                //komunkat w razie powodzenia
                toast.success('dane zostały odkodowane!');
            }
        } catch (error) {
            //komunkat w razie niepowodzenia i wypisanie błędu z serwera w konsoli
            toast.error('dane nie zostały odkodowane!');
            console.error('Błąd podczas przesyłania obrazu QR:', error);
        }

};