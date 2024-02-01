import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import "./AddProduct.css";
import {AuthContext} from '../../account/auth-context';
import {API_URL} from "../../settings/config";
import {Icon} from "@iconify/react";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {initializeProduct} from "../hooks/initializeProduct";
import {submitProduct} from "../API/submitProduct";
import {handleImageChange} from "../pictures/handleImageChange";
import {handleQRChange} from "../QR/handleQRChange";
import groceryBag from '../../../data/groceryBag.svg'

function AddProduct() {
    const {user} = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;
    const [refresh, setRefresh] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [product, setProduct] = useState(initializeProduct);
    const [qrImage, setQrImage] = useState('');
    const [qrImagePreview, setQrImagePreview] = useState(null);
    const [qrData, setQrData] = useState(null);
    const [productBackpack, setProductBackpack] = useState([]);
    const [showCameraOptions, setShowCameraOptions] = useState(false); // New state variable
    const [cameraOption, setCameraOption] = useState("");
    const [oneIdCameraOptions, setOneIdCameraOptions] = useState(false);
    const [streamCamera, setStreamCamera] = useState(null);
    const [imageIdentyfication, setImageIdentyfication] = useState(null);
    const [imageForIdentyficationURL, setImageForIdentyficationURL] = useState(null);


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Wysyłam produkt:", product);
        console.log('id-sesji:' + sessionId);

        // Wywołanie funkcji submitProduct z odpowiednimi parametrami
        submitProduct(product, sessionId, image, setImage, setImagePreview, setRefresh, setProduct);
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

        console.log(imageForIdentyficationURL);
        console.log(imageIdentyfication);

    }, [refresh, imageIdentyfication]);


    const handleQRCodeScan = async () => {
        if (qrImage) { // Upewnij się, że masz zeskanowany obraz QR dostępny w zmiennej "image"
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
                    console.log('Zdekodowane dane QR:', response.data);
                    setQrData(response.data)


                    const keyValuePairs = response.data.split(',');
                    const parsedData = keyValuePairs.reduce((obj, pair) => {
                        const [key, value] = pair.split(':');
                        obj[key.trim()] = value.trim();
                        return obj;
                    }, {});
                    const startIndex = 26; // 27th character
                    const endIndex = response.data.indexOf(',', 27);
                    console.log('Zdekodowane dane QR w zmiennej:', parsedData);
                    // Możesz przypisać te dane do odpowiednich pól w swoim formularzu
                    setProduct(() => ({

                        nazwa: response.data.substring(27, endIndex), // Przykład przypisania danych do pola "nazwa"
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
                    setQrImagePreview(null);

                }
            } catch (error) {
                console.error('Błąd podczas przesyłania obrazu QR:', error);
            }
        }
    };
    const handleAddToBackpack = () => {
        const newProduct = {
            nazwa: 'siema',
            cena: 2,
            kalorie: 3,
            tluszcze: 3,
            weglowodany: 1,
            bialko: 5,
            kategoria: 'cze',
            ilosc: 1,
            data_waznosci: new Date().toISOString().split('T')[0],
        };

        setProductBackpack(prevBackpack => [...prevBackpack, newProduct]);
    };
    const handleBackpackClick = () => {
        if (productBackpack.length > 0) {
            // Wybierz pierwszy produkt z listy
            const selectedProduct = productBackpack[0];

            // Ustaw stan produktu na wybrany produkt
            setProduct(selectedProduct);

            // Usuń wybrany produkt z listy productBackpack
            setProductBackpack(prevBackpack => prevBackpack.filter((_, index) => index !== 0));
        }
    };

    const chooseImageForIdentyfiaction = (event) => {
        if (event.target.files && event.target.files[0]) {
            const imageFile = event.target.files[0];
            setImageIdentyfication(imageFile);
            setImageForIdentyficationURL(URL.createObjectURL(imageFile));
            setShowCameraOptions(false)
            setOneIdCameraOptions(false)
        }

    }

    const sendImageToFlask = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_URL}/upload_image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setImageForIdentyficationURL(null)
            console.log(response.data);
            if (response.data.prediction) {
                console.log(response.data.prediction);
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCameraClick = () => {
        setCameraOption(""); // Reset camera option on opening
        setShowCameraOptions(!showCameraOptions); // Toggle visibility of camera options
    };

    const cameraControl = () => {
        axios.post(`${API_URL}/start_camera`)
            .then((response) => {
                console.log(response.data);
                toast.success('Camera started!');
                setStreamCamera(`${API_URL}/stream_camera`);
            })
            .catch((error) => {
                setStreamCamera(null);
                console.error(`Error starting camera: ${error}`);
            });
    };

    const stopCamera = () => {
        axios.post(`${API_URL}/stop_camera`)
            .then((response) => {
                console.log(response.data);
                toast.success('Camera stopped!');
                setStreamCamera(null);
            })
            .catch((error) => {
                console.error(`Error stopping camera: ${error}`);
            });
    };


    const showOneIdCameraOptions = () => {
        setOneIdCameraOptions(!oneIdCameraOptions)
    }

    return (
        <>
            {streamCamera ?
                <div className="rightCameraOptionUsed"><img className="rightCameraOptionView" src={streamCamera}/>
                    <div onClick={stopCamera} className="stopCameraButton"><Icon className="stopCameraButtonIcon"
                                                                                 icon="fluent-emoji-high-contrast:stop-button"
                                                                                 style={{color: '#f50000'}}/></div>
                </div> :
                <>

                    {imageForIdentyficationURL && <div className="imageForIdentyficationURLDiv">
                        <div className="imageForIdentyficationURLDivRelative">
                            <img src={imageForIdentyficationURL} className="scannedFoodImage"/>
                            <div className="sendButtonForFoodIdentyfication" onClick={() => {
                                sendImageToFlask(imageIdentyfication)
                            }}>
                                <h2>
                                    identyfikuj
                                </h2>
                            </div>
                        </div>
                    </div>}
                    <div className="productContainerDiv">
                        {productBackpack.length > 0 &&
                            <div className="backpackAddProductDiv" onClick={handleBackpackClick}>
                                <img className="backpackAddProduct" src={groceryBag}/>
                                <span className="backpackCounter">{productBackpack.length}</span>
                            </div>}
                        <div onClick={handleAddToBackpack}>
                            czesc
                            {productBackpack.map((product, index) => (
                                <div key={index}>{product.nazwa} i inne dane...</div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="addProductForm">
                            <label>
                                <h5>Nazwa:</h5>
                                <input type="text" name="nazwa" value={product.nazwa} onChange={handleChange}/>
                            </label>
                            <label>
                                <h5>Cena:</h5>
                                <input type="number" name="cena" value={product.cena} onChange={handleChange}/>
                            </label>
                            <label>
                                <h5> Kalorie:</h5>
                                <input type="number" name="kalorie" value={product.kalorie} onChange={handleChange}/>
                            </label>
                            <label>
                                <h5> Tłuszcze:</h5>
                                <input type="number" name="tluszcze" value={product.tluszcze} onChange={handleChange}/>
                            </label>
                            <label>
                                <h5>Węglowodany:</h5>
                                <input type="number" name="weglowodany" value={product.weglowodany}
                                       onChange={handleChange}/>
                            </label>
                            <label>
                                <h5> Białko:</h5>
                                <input type="number" name="bialko" value={product.bialko} onChange={handleChange}/>
                            </label>
                            <label>
                                <h5>Kategoria:</h5>
                                <input type="text" name="kategoria" value={product.kategoria} onChange={handleChange}/>
                            </label>
                            <label>
                                <h5>Ilość:</h5>
                                <input type="number" name="ilosc" value={product.ilosc} onChange={handleChange}/>
                            </label>
                            <label className="dataLabel">
                                <h5>Data ważności:</h5>
                                <input type="date" name="data_waznosci" className="dataInput"
                                       value={product.data_waznosci}
                                       onChange={handleChange}/>
                            </label>
                            <div className="addPhotoDiv">

                                <div className="image-options">

                                    <label className="addPhotoFromDir">
                                        <label><h5> dodaj zdjęcie: </h5></label>
                                        {!image && <Icon className="addPhotoFromDirIcon" icon="arcticons:photo-pro"/>}
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
                                            onChange={(e) => handleImageChange(e, setImage, setProduct, setImagePreview)}
                                        />
                                    </label>

                                    <label className="addPhotoFromDir">

                                        <label><h5> identyfikuj </h5></label>
                                        <div className="cameraOptions"
                                             style={{display: showCameraOptions ? 'flex' : 'none'}}>
                                            <div className="cameraOptionsRelative">
                                                <div className="leftCameraOption" onClick={showOneIdCameraOptions}>
                                                    <label><h5>jeden</h5></label>
                                                    {oneIdCameraOptions &&
                                                        <div className="chooseFormOfId"
                                                             onClick={event => event.stopPropagation()}>

                                                            {!imageForIdentyficationURL && <>

                                                                <input
                                                                    type="file"
                                                                    id="file-input"
                                                                    style={{display: 'none'}}
                                                                    onChange={(e) => chooseImageForIdentyfiaction(e)}
                                                                />

                                                            </>}

                                                        </div>
                                                    }
                                                    <Icon icon="ic:twotone-exposure-plus-1"/>

                                                </div>
                                                <div className="rightCameraOption" onClick={cameraControl}>
                                                    <label><h5>wiele</h5></label>
                                                    <Icon icon="oui:ml-create-multi-metric-job"/>
                                                </div>

                                            </div>
                                        </div>


                                        <Icon className="addPhotoFromDirIcon" icon="icon-park-twotone:camera-one"
                                              onClick={handleCameraClick}/>

                                        <span> <h5>jedzenie</h5> </span>

                                    </label>
                                </div>

                            </div>
                            <div className="AddProductButtonDiv">
                                <button type="submit" className="addProductButton"><h4> Dodaj produkt </h4></button>
                            </div>
                            <div className="qrUploadDiv">

                            </div>
                            <div className="scanners">

                                <label onClick={handleQRCodeScan} className="scannerLabel">


                                    {!qrImage && <Icon className="qrIcon" icon="bx:qr-scan"/>}
                                    {qrImagePreview && (
                                        <img
                                            src={qrImagePreview}
                                            alt="Podgląd"
                                            style={{maxWidth: '100px', maxHeight: '100px'}}
                                        />
                                    )}
                                    <h5> Skanuj QR </h5>
                                    {!qrImage && <input
                                        type="file"
                                        id="file-input"
                                        style={{display: 'none'}}
                                        onChange={(e) => handleQRChange(e, setQrImage, setQrImagePreview)}
                                    />}
                                </label>

                            </div>


                        </form>

                    </div>

                </>
            }
        </>
    );
}

export default AddProduct;