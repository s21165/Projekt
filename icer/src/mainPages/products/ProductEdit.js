import React, {useEffect, useRef, useState} from 'react';
import './AddProduct.css'

import {Icon} from "@iconify/react";
import {useOutsideClick} from "./useOutsideClick";
import {useEditProduct} from "./useEditProduct";
import {handleImageChange} from "./handleImageChange";

function ProductEdit({product, handleEdit, setEditingProduct}) {

    const myDivRef = useRef(null);
    const {
        editProduct, image, setEditProduct, setImage, imagePreview, setImagePreview,handleChange
    } = useEditProduct(product);

    useOutsideClick(myDivRef, () => setEditingProduct(null));


    const handleUpdate = () => {
        handleEdit({...editProduct, image});
        setEditingProduct(null);
    };


    return (
        <div className="productContainerDiv">
            <form onSubmit={handleUpdate} className="addProductForm" ref={myDivRef}>
                <label>
                    <h5>Nazwa:</h5>
                    <input type="text" name="nazwa" value={editProduct.nazwa} onChange={handleChange}/>
                </label>
                <label>
                    <h5>Cena:</h5>
                    <input type="text" name="cena" value={editProduct.cena} onChange={handleChange}/>
                </label>
                <label>
                    <h5> Kalorie:</h5>
                    <input type="text" name="kalorie" value={editProduct.kalorie} onChange={handleChange}/>
                </label>
                <label>
                    <h5> Tłuszcze:</h5>
                    <input type="text" name="tluszcze" value={editProduct.tluszcze} onChange={handleChange}/>
                </label>
                <label>
                    <h5>Węglowodany:</h5>
                    <input type="text" name="weglowodany" value={editProduct.weglowodany} onChange={handleChange}/>
                </label>
                <label>
                    <h5> Białko:</h5>
                    <input type="text" name="bialko" value={editProduct.bialko} onChange={handleChange}/>
                </label>
                <label>
                    <h5>Kategoria:</h5>
                    <input type="text" name="kategoria" value={editProduct.kategoria} onChange={handleChange}/>
                </label>
                <label>
                    <h5>Ilość:</h5>
                    <input type="text" name="ilosc" value={editProduct.ilosc} onChange={handleChange}/>
                </label>
                <label className="dataLabel">
                    <h5>Data ważności:</h5>
                    <input type="date" name="data_waznosci" className="dataInput" value={editProduct.data_waznosci}
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
                                onChange={(e) => handleImageChange(e, setImage, setEditProduct,setImagePreview)}
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

export default ProductEdit;
