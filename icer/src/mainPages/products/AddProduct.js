import React, {useEffect, useState} from 'react';
import axios from 'axios';
import "./AddProduct.css";
import {ScanQr} from "./ScanQr";
import {ScanBr} from "./scanBr";
import {useContext} from 'react';
import {AuthContext} from '../account/auth-context';
import {API_URL} from "../../config";
import {Icon} from "@iconify/react";


function AddProduct() {
    const {user} = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;
    const [refresh, setRefresh] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
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
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {

        if (image) { //jeśli jest już jakieś zdjęcie to je usuń przed próbą wybrania kolejnego
            URL.revokeObjectURL(image);
            setImage(null);
            setImagePreview(null);
        }
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
        console.log('id-sesji:' + sessionId);
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
                URL.revokeObjectURL(image); //zwolnij pamięć zdjęcia po jego zapisaniu
                setImage(null);
                setImagePreview(null);
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
        <div className="productContainerDiv">
            <form onSubmit={handleSubmit} className="addProductForm">
                <label>
                    <h5>Nazwa:</h5>
                    <input type="text" name="nazwa" value={product.nazwa} onChange={handleChange}/>
                </label>
                <label>
                    <h5>Cena:</h5>
                    <input type="text" name="cena" value={product.cena} onChange={handleChange}/>
                </label>
                <label>
                    <h5> Kalorie:</h5>
                    <input type="text" name="kalorie" value={product.kalorie} onChange={handleChange}/>
                </label>
                <label>
                    <h5> Tłuszcze:</h5>
                    <input type="text" name="tluszcze" value={product.tluszcze} onChange={handleChange}/>
                </label>
                <label>
                    <h5>Węglowodany:</h5>
                    <input type="text" name="weglowodany" value={product.weglowodany} onChange={handleChange}/>
                </label>
                <label>
                    <h5> Białko:</h5>
                    <input type="text" name="bialko" value={product.bialko} onChange={handleChange}/>
                </label>
                <label>
                    <h5>Kategoria:</h5>
                    <input type="text" name="kategoria" value={product.kategoria} onChange={handleChange}/>
                </label>
                <label>
                    <h5>Ilość:</h5>
                    <input type="text" name="ilosc" value={product.ilosc} onChange={handleChange}/>
                </label>
                <label className="dataLabel">
                    <h5>Data ważności:</h5>
                    <input type="date" name="data_waznosci" className="dataInput" value={product.data_waznosci}
                           onChange={handleChange}/>
                </label>
                <div className="addPhotoDiv">
                    <label><h5> Zdjęcie: </h5></label>
                    <div className="image-options">
                        <label className="addPhotoFromDir">
                            {!image && <Icon className="addPhotoFromDirIcon" icon="clarity:directory-line"/>}
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Podgląd"
                                    style={{maxWidth: '100px', maxHeight: '100px'}}
                                />
                            )}
                            <span> <h5> dodaj z urządzenia </h5> </span>
                            <input
                                type="file"
                                id="file-input"
                                style={{display: 'none'}}
                                onChange={handleImageChange}
                            />
                        </label>
                        <label className="addPhotoByCamera">
                            <Icon className="addPhotoByCameraIcon" icon="arcticons:photo-pro"/>
                            <span> <h5>zrób teraz </h5> </span>
                        </label>
                    </div>

                </div>
                <div className="AddProductButtonDiv">
                    <button type="submit" className="addProductButton"><h4> Dodaj produkt </h4></button>
                </div>
                <div className="scanners">

                    <label className="scannerLabel">
                        <Icon className="barcodeIcon" icon="material-symbols:barcode"/>
                        <span> <h5>Skanuj Barcode</h5> </span>
                    </label>

                    <label className="scannerLabel">
                        <Icon className="qrIcon" icon="bx:qr-scan"/>
                        <h5> Skanuj QR </h5>
                    </label>

                </div>


            </form>

        </div>
    );
}

export default AddProduct;