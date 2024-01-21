import {useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "../config";
import './Settings.css'

export function Settings({where}) {

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

    const sectionHeaderClass = `settings-sectionHeader ${
            
    where === 'products' ||  where === 'fridge'   ? 'settings-sectionHeader--products' : ''
    }`;
    const customRadioButtonClass = `custom-radio-button ${

        (where === 'products' ||  where === 'fridge')   ? 'custom-radio-button--products' : ''
    }`;

    const settingsDivClass = `settingsDiv ${
            where === 'products' ||  where === 'fridge'   ? 'settingsDiv--products' : ''
    }`;

    return (
        <div className="settings-container"
             style={{}}

        >

            <div className={settingsDivClass}>
                {where === 'settings' && <h1 className="settingsHeader">Ustawienia</h1>}
                {(where === 'fridge' || where === 'settings') && <div className="settings-section">
                    <h2 className={sectionHeaderClass}>Wielkość towarów w lodówce</h2>
                    <div className="custom-radio-container">
                        {fridgeSizeElementsArray.map((label, i) => (
                            <div
                                key={i}
                                className={`${customRadioButtonClass} ${fridgeSizeElements === i ? 'selected' : ''}`}
                                onClick={() => handleOptionClick(i, setFridgeSizeElements)}
                            >
                                {where ==='settings' ? <label>{label}</label> : <h5>{label}</h5>}
                            </div>

                        ))}
                    </div>
                </div>}

                {(where === 'products' || where === 'settings') &&
                    <>
                        <div className="settings-section">
                            <h2 className={sectionHeaderClass}>Wielkość towarów na stronie produktów</h2>
                            <div className="custom-radio-container">
                                {productsSizeElementsArray.map((label, i) => (
                                    <div
                                        key={i}
                                        className={`${customRadioButtonClass} ${productsSizeElements === i ? 'selected' : ''}`}
                                        onClick={() => handleOptionClick(i, setProductsSizeElements)}
                                    >
                                        {where ==='settings' ? <label>{label}</label> : <h5>{label}</h5>}
                                    </div>

                                ))}
                            </div>
                        </div>

                        <div className="settings-section">
                            <h2 className={sectionHeaderClass}>Informacje o produktach widoczne na stronie
                                produktów</h2>
                            <div className="custom-radio-container">
                                {infoProductsArray.map((label, i) => (
                                    <div
                                        key={i}
                                        className={`${customRadioButtonClass} ${infoProducts === i ? 'selected' : ''}`}
                                        onClick={() => handleOptionClick(i, setInfoProducts)}
                                    >
                                        {where ==='settings' ? <label>{label}</label> : <h5>{label}</h5>}
                                    </div>

                                ))}
                            </div>
                        </div>
                    </>}
                {where === 'settings' &&
                    <div className="saveDivSettings">
                        <button className="saveButtonSettings"><h1>zapisz</h1></button>
                    </div>}
            </div>
        </div>
    );
}
