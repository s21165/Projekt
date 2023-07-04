import React, { useState } from 'react';
import axios from 'axios';
import "./AddProduct.css"

function AddProduct() {
    const [product, setProduct] = useState({
        nazwa: '',
        cena: 0,
        kalorie: 0,
        tluszcze: 0,
        weglowodany: 0,
        bialko: 0,
        kategoria: '',
        ilosc: 0,
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
            .post('http://localhost:5000/api/products', product)
            .then((response) => {
                console.log(response.data);
                // Możesz wykonać odpowiednie akcje po dodaniu produktu, np. zaktualizować listę produktów
            })
            .catch((error) => {
                console.error(`There was an error adding the product: ${error}`);
            });

        setProduct({
            nazwa: '',
            cena: 0,
            kalorie: 0,
            tluszcze: 0,
            weglowodany: 0,
            bialko: 0,
            kategoria: '',
            ilosc: 0,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="addProductForm">
            <label>
                Nazwa:
                <input type="text" name="nazwa" value={product.nazwa} onChange={handleChange} />
            </label>
            <label>
                Cena:
                <input type="text" name="cena" value={product.cena} onChange={handleChange} />
            </label>
            <label>
                Kalorie:
                <input type="text" name="kalorie" value={product.kalorie} onChange={handleChange} />
            </label>
            <label>
                Tłuszcze:
                <input type="text" name="tluszcze" value={product.tluszcze} onChange={handleChange} />
            </label>
            <label>
                Węglowodany:
                <input type="text" name="weglowodany" value={product.weglowodany} onChange={handleChange} />
            </label>
            <label>
                Białko:
                <input type="text" name="bialko" value={product.bialko} onChange={handleChange} />
            </label>
            <label>
                Kategoria:
                <input type="text" name="kategoria" value={product.kategoria} onChange={handleChange} />
            </label>
            <label>
                Ilość:
                <input type="text" name="ilosc" value={product.ilosc} onChange={handleChange} />
            </label>

            <button type="submit">Dodaj produkt</button>
        </form>
    );
}

export default AddProduct;