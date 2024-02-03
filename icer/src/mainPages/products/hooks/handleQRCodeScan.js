import axios from "axios";
import {API_URL} from "../../settings/config";

export const handleQRCodeScan = async (
    qrImage,
    setProduct,
    setQrImage,
    setQrImagePreview

) => {
    if(!qrImage) return;

    const formData = new FormData();
        formData.append('qr_code_image', qrImage);

        try {
            const response = await axios.post(`${API_URL}/decode_qr_code`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                // Tutaj możesz obsłużyć zdekodowane dane zeskanowanego QR kodu

                const keyValuePairs = response.data.split(',');
                const parsedData = keyValuePairs.reduce((obj, pair) => {
                    const [key, value] = pair.split(':');
                    obj[key.trim()] = value.trim();
                    return obj;
                }, {});

                const endIndex = response.data.indexOf(',', 28);
                console.log('Zdekodowane dane QR w zmiennej:', parsedData);
                // Możesz przypisać te dane do odpowiednich pól w swoim formularzu
                setProduct(() => ({

                    nazwa: response.data.substring(28, endIndex), // Przykład przypisania danych do pola "nazwa"
                    cena: parsedData.Price,
                    kalorie: parsedData.Kcal,
                    tluszcze: parsedData.Fat,
                    weglowodany: parsedData.Carbs,
                    bialko: parsedData.Protein,
                    kategoria: parsedData.Category,
                    ilosc: parsedData.Amount,
                    data_waznosci: new Date().toISOString().split('T')[0],
                }));
                setQrImage('');
                setQrImagePreview('');

            }
        } catch (error) {
            console.error('Błąd podczas przesyłania obrazu QR:', error);
        }

};