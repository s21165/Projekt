import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from './config';

function RemoveProduct() {
    const [product, setProduct] = useState({
        nazwa: '',
        ilosc: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .put(`${API_URL}/api/products/${product.nazwa}`, product)
            .then((response) => {
                console.log(response.data);
                // Możesz wykonać odpowiednie akcje po usunięciu produktu
            })
            .catch((error) => {
                console.error(`There was an error removing the product: ${error}`);
            });

        setProduct({
            nazwa: '',
            ilosc: '',
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Nazwa:
                <input type="text" name="nazwa" value={product.nazwa} onChange={handleChange} />
            </label>
            <label>
                Ilość:
                <input type="text" name="ilosc" value={product.ilosc} onChange={handleChange} />
            </label>

            <button type="submit">Usuń produkt</button>
        </form>
    );
}

export default RemoveProduct;