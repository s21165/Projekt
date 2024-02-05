import React, {useRef, useState} from 'react';
import '../add/AddProduct.css'

import {Icon} from "@iconify/react";
import {useOutsideClick} from "../hooks/useOutsideClick";
import {useEditProduct} from "../hooks/useEditProduct";
import {handleImageChange} from "../pictures/handleImageChange";
import {handleQRCodeScan} from "../API/handleQRCodeScan";
import {handleQRChange} from "../QR/handleQRChange";

//funkcja odpowiedzialna za widok strony edycji produktu. Przyjmuje produkt do edycji, funkcję edycji produktu, ustawienie produktu do edycji
function ProductEdit({product, handleEdit, setEditingProduct}) {

    //referencja do formularza edycji
    const myDivRef = useRef(null);

    //zmienna, która posiada kod QR
    const [qrImage, setQrImage] = useState('');

    //podgląd kodu QR
    const [qrImagePreview, setQrImagePreview] = useState('');

    //pobieram zmienne i funkcje do wykonywania działań na produkcie do edycji
    const {
        editProduct, image, setEditProduct, setImage, imagePreview, setImagePreview, handleChange
    } = useEditProduct(product);

    //funkcja, która po naciśnięciu poza referowany kontener zmienia wartość edycji produktu na null
    useOutsideClick(myDivRef, () => setEditingProduct(null));

    //funkcja zatwierdzająca wprowadzone dane do formularza
    const handleUpdate = (e) => {
        //zapobiega odświeżeniu
        e.preventDefault();

        //wywołuje funkcję edycji produktu wraz z informacjami o produkcie oraz zdjęciem
        handleEdit({...editProduct, image});
        //zmienia wartość edycji produktu na null co skutkuje tym, że wychodzimy z trybu edycji produktu
        setEditingProduct(null);

    };

    return (
        /*kontener z formularzem*/
        <div className="productContainerDiv">
            {/*formularz edycji z polami o tych samych klasach co w dodawaniu produktu*/}
            <form onSubmit={handleUpdate} className="addProductForm" ref={myDivRef}>
                <label>
                    <h5>Nazwa:</h5>
                    <input type="text" name="nazwa" value={editProduct.nazwa} onChange={handleChange}/>
                </label>
                <label>
                    <h5>Cena:</h5>
                    <input type="number" name="cena" value={editProduct.cena} onChange={handleChange}/>
                </label>
                <label>
                    <h5> Kalorie:</h5>
                    <input type="number" name="kalorie" value={editProduct.kalorie} onChange={handleChange}/>
                </label>
                <label>
                    <h5> Tłuszcze:</h5>
                    <input type="number" name="tluszcze" value={editProduct.tluszcze} onChange={handleChange}/>
                </label>
                <label>
                    <h5>Węglowodany:</h5>
                    <input type="number" name="weglowodany" value={editProduct.weglowodany} onChange={handleChange}/>
                </label>
                <label>
                    <h5> Białko:</h5>
                    <input type="number" name="bialko" value={editProduct.bialko} onChange={handleChange}/>
                </label>
                <label>
                    <h5>Kategoria:</h5>
                    <input type="text" name="kategoria" value={editProduct.kategoria} onChange={handleChange}/>
                </label>
                <label>
                    <h5>Ilość:</h5>
                    <input type="number" name="ilosc" value={editProduct.ilosc} onChange={handleChange}/>
                </label>
                <label className="dataLabel">
                    <h5>Data ważności:</h5>
                    <input type="date" name="data_waznosci" className="dataInput" value={editProduct.data_waznosci}
                           onChange={handleChange}/>
                </label>

                {/* kontener ze zdjęciem */}
                <div className="addPhotoDiv">
                    <label><h5> Zdjęcie: </h5></label>
                    <div className="image-options">
                        <label className="addPhotoFromDir">
                            {/* jeśli nie ma zdjęcia to pokaż ikonę */}
                            {!image && <Icon className="addPhotoFromDirIcon" icon="clarity:directory-line"/>}
                            {/* jeśli jest podgląd to pokaż go */}
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Podgląd"
                                    style={{maxWidth: '100px', maxHeight: '100px'}}
                                />
                            )}
                            <span> <h5> dodaj z urządzenia </h5> </span>
                            {/* dodawanie zdjęcia */}
                            <input
                                type="file"
                                id="file-input"
                                style={{display: 'none'}}
                                onChange={(e) => handleImageChange(e, setImage, setEditProduct, setImagePreview)}
                            />
                        </label>
                        <label className="addPhotoByCamera">
                            <Icon className="addPhotoByCameraIcon" icon="arcticons:photo-pro"/>
                            <span> <h5>zrób teraz </h5> </span>
                        </label>
                    </div>

                </div>
                <div className="AddProductButtonDiv">
                    <button type="submit" className="addProductButton"><h4> Zaktualizuj </h4></button>
                </div>
                <div className="scanners">

                    {/* etytkieta, której naciśnięcie wywoła skanowanie kodu QR */}
                    <label onClick={() => {
                        handleQRCodeScan(qrImage,
                            setEditProduct,
                            setQrImage,
                            setQrImagePreview)
                    }} className="scannerLabel">

                        {/* jeśli nie ma obrazu QR to pokaż ikonę */}
                        {!qrImage && <Icon className="qrIcon" icon="bx:qr-scan"/>}
                        {/* jeśli jest podlgąd QR to pokaż go   */}
                        {qrImagePreview && (
                            <img
                                src={qrImagePreview}
                                alt="Podgląd"
                                style={{maxWidth: '100px', maxHeight: '100px'}}
                            />
                        )}
                        <h5> Skanuj QR </h5>
                        {/* jeśli nie ma obrazku QR to pokaż pole od jego dodania:  */}
                        {!qrImage && <input
                            type="file"
                            id="file-input"
                            style={{display: 'none'}}
                            /* obsługiwanie zmiany kod QR  */
                            onChange={(e) => handleQRChange(e, setQrImage, setQrImagePreview)}
                        />}
                    </label>
                </div>


            </form>

        </div>
    );
}

export default ProductEdit;
