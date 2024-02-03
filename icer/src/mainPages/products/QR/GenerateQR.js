import {AuthContext} from "../../account/auth-context";
import React, {useContext, useState} from "react";
import {Icon} from "@iconify/react";
import {handleImageChange} from "../pictures/handleImageChange";
import "../add/AddProduct.css";
import {generateQRCode} from "../API/generateQRCode";

export function GenerateQR() {

    const [formData, setFormData] = useState({
        name: 'kodQR',
        price: 0,
        kcal: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
        category: 0,
        amount: 0,
        date: new Date().toISOString().split('T')[0],
    });

    const {user} = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const qrData = await generateQRCode(formData);
            console.log("QR Code generated:", qrData);
            // Tutaj możesz zaktualizować stan komponentu, np. wyświetlić wygenerowany kod QR

        } catch (error) {
            // Obsługa błędów, np. wyświetlenie komunikatu
            console.error('Error in generating QR code:', error);
        }
    };

    return (
        <>


            <div className="productContainerDiv">

                <form onSubmit={handleSubmit} className="addProductForm">
                    <label>
                        <h5>Nazwa:</h5>
                        <input type="text" name="name" value={formData.name} onChange={handleChange}/>
                    </label>
                    <label>
                        <h5>Cena:</h5>
                        <input type="number" name="price" value={formData.price} onChange={handleChange}/>
                    </label>
                    <label>
                        <h5> Kalorie:</h5>
                        <input type="number" name="kcal" value={formData.kcal} onChange={handleChange}/>
                    </label>
                    <label>
                        <h5> Tłuszcze:</h5>
                        <input type="number" name="fat" value={formData.fat} onChange={handleChange}/>
                    </label>
                    <label>
                        <h5>Węglowodany:</h5>
                        <input type="number" name="carbs" value={formData.carbs} onChange={handleChange}/>
                    </label>
                    <label>
                        <h5> Białko:</h5>
                        <input type="number" name="protein" value={formData.protein} onChange={handleChange}/>
                    </label>
                    <label>
                        <h5>Kategoria:</h5>
                        <input type="text" name="category" value={formData.category} onChange={handleChange}/>
                    </label>
                    <label>
                        <h5>Ilość:</h5>
                        <input type="number" name="amount" value={formData.amount} onChange={handleChange}/>
                    </label>
                    <label className="dataLabel">
                        <h5>Data ważności:</h5>
                        <input type="date" name="date" className="dataInput" value={formData.date}
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
                                    onChange={(e) => handleImageChange(e, setImage, setFormData, setImagePreview)}
                                />
                            </label>
                            <label className="addPhotoByCamera">
                                <Icon className="addPhotoByCameraIcon" icon="arcticons:photo-pro"/>
                                <span> <h5>zrób teraz </h5> </span>
                            </label>
                        </div>

                    </div>
                    <div className="AddProductButtonDiv">
                        <button type="submit" className="addProductButton"><h4> Generuj </h4></button>
                    </div>
                    <div className="qrUploadDiv">

                    </div>

                </form>

            </div>

        </>
    );
}
