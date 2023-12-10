import React, {useEffect, useState} from 'react';
import axios from 'axios';
import "./AddProduct.css"
import {ScanQr} from "./ScanQr";
import {ScanBr} from "./scanBr";
import {useContext} from 'react';
import {AuthContext} from '../account/auth-context';
import {API_URL} from "../../config";



function AddProduct() {
    const {user} = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;
    const [refresh, setRefresh] = useState(false);
    const [product, setProduct] = useState({
        nazwa: 'Nowy Produkt',
        cena: 0,
        kalorie: 0,
        tluszcze: 0,
        weglowodany: 0,
        bialko: 0,
        kategoria: 'Jedzenie',
        ilosc: 1,
        data_waznosci: '',
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setProduct((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setProduct((prevState) => ({
            ...prevState,
            data_waznosci: today,
        }));
    }, [refresh]);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Wysyłam produkt:", product);
        console.log('id-sesji:' +sessionId);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'session_id': sessionId  // dodajemy sessionId
            },
        };
        axios
            .post(`${API_URL}/api/add_product`, product, config)
            .then((response) => {

                console.log(`Dodane: ${JSON.stringify(response.data)}`);

            })
            .catch((error) => {
                console.error(`There was an error adding the product: ${error}`);
            });
        setRefresh(!refresh);
        setProduct({
            nazwa: 'Nowy Produkt',
            cena: 0,
            kalorie: 0,
            tluszcze: 0,
            weglowodany: 0,
            bialko: 0,
            kategoria: 'Jedzenie',
            ilosc: 1,
            data_waznosci: '',
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="addProductForm">
                <label>
                    Nazwa:
                    <input type="text" name="nazwa" value={product.nazwa} onChange={handleChange}/>
                </label>
                <label>
                    Cena:
                    <input type="text" name="cena" value={product.cena} onChange={handleChange}/>
                </label>
                <label>
                    Kalorie:
                    <input type="text" name="kalorie" value={product.kalorie} onChange={handleChange}/>
                </label>
                <label>
                    Tłuszcze:
                    <input type="text" name="tluszcze" value={product.tluszcze} onChange={handleChange}/>
                </label>
                <label>
                    Węglowodany:
                    <input type="text" name="weglowodany" value={product.weglowodany} onChange={handleChange}/>
                </label>
                <label>
                    Białko:
                    <input type="text" name="bialko" value={product.bialko} onChange={handleChange}/>
                </label>
                <label>
                    Kategoria:
                    <input type="text" name="kategoria" value={product.kategoria} onChange={handleChange}/>
                </label>
                <label>
                    Ilość:
                    <input type="text" name="ilosc" value={product.ilosc} onChange={handleChange}/>
                </label>
                <label>
                    Data ważności:
                    <input type="date" name="data_waznosci" value={product.data_waznosci} onChange={handleChange}/>
                </label>

                <button type="submit" className="addProductButton">Dodaj produkt</button>
                <div className="scanners">
                    <ScanBr/>
                    <ScanQr/>
                </div>
            </form>

        </>
    );
}

export default AddProduct;