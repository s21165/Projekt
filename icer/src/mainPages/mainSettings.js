import {useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "../config";
import './Settings.css'

export function Settings( where ) {

    const [fridgeSizeElements, setFridgeSizeElements] = useState(1);
    const [productsSizeElements, setProductsSizeElements] = useState(1);
    const [infoProducts, setInfoProducts] = useState(0);

    const fridgeSizeElementsArray = ['bardzo małe', 'małe', 'średnie', 'duże', 'bardzo duże'];
    const handleOptionClick = (optionValue, setter) => {
        setter(optionValue);
    }
    // Nazwy dla drugiej grupy opcji
    const productsSizeElementsArray = ['bardzo małe', 'małe', 'średnie', 'duże', 'bardzo duże'];
    const infoProductsArray = ['tak', 'nie'];
    return (
        <div className="settings-container">

            <div className="settingsDiv">
                {where ==='settings' &&<h1 className="settingsHeader">Ustawienia</h1>}
                {<div className="settings-section">
                    <h2 className="settings-sectionHeader">Wielkość towarów w lodówce</h2>
                    <div className="custom-radio-container">
                        {fridgeSizeElementsArray.map((label, i) => (
                            <div
                                key={i}
                                className={`custom-radio-button ${fridgeSizeElements === i  ? 'selected' : ''}`}
                                onClick={() => handleOptionClick(i ,setFridgeSizeElements)}
                            >
                                {label}
                            </div>

                        ))}
                    </div>
                </div>}
                <div className="settings-section">
                    <h2 className="settings-sectionHeader">Wielkość towarów na stronie produktów</h2>
                    <div className="custom-radio-container">
                        {productsSizeElementsArray.map((label, i) => (
                            <div
                                key={i}
                                className={`custom-radio-button ${productsSizeElements === i  ? 'selected' : ''}`}
                                onClick={() => handleOptionClick(i ,setProductsSizeElements)}
                            >
                                {label}
                            </div>

                        ))}
                    </div>
                </div>
                <div className="settings-section">
                    <h2 className="settings-sectionHeader">Informacje o produktach widoczne na stronie produktów</h2>
                    <div className="custom-radio-container">
                        {infoProductsArray.map((label, i) => (
                            <div
                                key={i}
                                className={`custom-radio-button ${infoProducts === i  ? 'selected' : ''}`}
                                onClick={() => handleOptionClick(i ,setInfoProducts)}
                            >
                                {label}
                            </div>

                        ))}
                    </div>
                </div>
                <div  className="saveDivSettings">
                    <button className="saveButtonSettings"><h1>zapisz</h1></button>
                </div>
            </div>
        </div>
    );
}
