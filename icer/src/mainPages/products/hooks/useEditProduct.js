import {useEffect, useState} from 'react';
import {handleImageChange} from "../pictures/handleImageChange";

//funkcja służąca za bazę podstawianych informacji o informacje produktu, który chcemy edytować, przyjmuje edytowany produkt
export const useEditProduct = (initialProduct) => {
    const [editProduct, setEditProduct] = useState({
        nazwa: initialProduct.nazwa,
        cena: initialProduct.cena,
        kalorie: initialProduct.kalorie,
        tluszcze: initialProduct.tluszcze,
        weglowodany: initialProduct.weglowodany,
        bialko: initialProduct.bialko,
        kategoria: initialProduct.kategoria,
        ilosc: initialProduct.ilosc,
        data_waznosci: initialProduct.data_waznosci,
    });


    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // ustawia zmiany w polach wejściowych aby były widoczne dla użytkownika
    const handleChange = (e) => {
        console.log(editProduct)
        const { name, value } = e.target;
        setEditProduct((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    //zwraca poniższe wartości
    return { editProduct, setEditProduct, image, setImage, imagePreview, setImagePreview, handleChange };
};
