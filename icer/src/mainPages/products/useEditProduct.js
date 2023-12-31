import { useState } from 'react';

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditProduct((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return { editProduct, setEditProduct, image, imagePreview, handleImageChange, handleChange };
};
