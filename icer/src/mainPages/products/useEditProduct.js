import {useEffect, useState} from 'react';
import {handleImageChange} from "./handleImageChange";

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

    const handleChange = (e) => {
        console.log(editProduct)
        const { name, value } = e.target;
        setEditProduct((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    return { editProduct, setEditProduct, image, setImage, imagePreview, setImagePreview, handleChange };
};
