import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "./config";
import './Settings.css'
import {AuthContext} from "../account/auth-context";
import SettingsContext from "./SettingsContext";

export function Settings({where}) {

    const { user } = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;
    const { fridgeSizeElements, setFridgeSizeElements, productsSizeElements, setProductsSizeElements, infoProducts, setInfoProducts } = useContext(SettingsContext);
    const [refresh,setRefresh] = useState(false);

    const fridgeSizeElementsArray = ['bardzo małe', 'małe', 'średnie', 'duże', 'bardzo duże'];
    const handleOptionClick = (optionValue, setter) => {

        setter(optionValue);
        setRefresh(!refresh);
    };
    // Nazwy dla drugiej grupy opcji
    const productsSizeElementsArray = ['bardzo małe', 'małe', 'średnie', 'duże', 'bardzo duże'];
    const infoProductsArray = ['nie','tak'];

    const sectionHeaderClass = `settings-sectionHeader ${
            
    where === 'products' ||  where === 'fridge'   ? 'settings-sectionHeader--products' : ''
    }`;
    const customRadioButtonClass = `custom-radio-button ${

        (where === 'products' ||  where === 'fridge')   ? 'custom-radio-button--products' : ''
    }`;

    const settingsDivClass = `settingsDiv ${
            where === 'products' ||  where === 'fridge'   ? 'settingsDiv--products' : ''
    }`;
    console.log(fridgeSizeElements + " " + productsSizeElements + " " + infoProducts )
    useEffect(() => {

        const preferences = {
            wielkosc_lodowki: fridgeSizeElements,
            wielkosc_strony_produktu:productsSizeElements,
            widocznosc_informacji_o_produkcie: infoProducts
        };

        axios.post(`${API_URL}/api/update_preferences`, { ...preferences, sessionId })
            .then((response) => {
                console.log('Preferences updated:', response.data);


            })
            .catch((error) => {
                console.error('Error updating preferences:', error);
            });
    },[refresh]);

    const mapSizeToApiValue = (sizeIndex) => {
        const sizeMapping = ['bardzo male', 'male', 'srednie', 'duze', 'bardzo duze'];
        return sizeMapping[sizeIndex];

    };



    return (
        <div className="settings-container"


        >

            <div className={settingsDivClass}>
                {where === 'settings' && <h1 className="settingsHeader">Ustawienia</h1>}
                {(where === 'fridge' || where === 'settings') && <div className="settings-section">
                    <h2 className={sectionHeaderClass}>Wielkość towarów w lodówce</h2>
                    <div className="custom-radio-container">
                        {fridgeSizeElementsArray.map((label, index) => (
                            <div
                                key={label}
                                className={`${customRadioButtonClass} ${fridgeSizeElements === mapSizeToApiValue(index) ? 'selected' : ''}`}
                                onClick={() => handleOptionClick(mapSizeToApiValue(index), setFridgeSizeElements)}
                            >
                                {label}
                            </div>
                        ))}
                    </div>
                </div>}

                {(where === 'products' || where === 'settings') &&
                    <>
                        <div className="settings-section">
                            <h2 className={sectionHeaderClass}>Wielkość towarów na stronie produktów</h2>
                            <div className="custom-radio-container">
                                {productsSizeElementsArray.map((label,index) => (
                                    <div
                                        key={label}
                                        className={`${customRadioButtonClass} ${productsSizeElements === mapSizeToApiValue(index) ? 'selected' : ''}`}
                                        onClick={() => handleOptionClick(mapSizeToApiValue(index), setProductsSizeElements)}
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
                                {infoProductsArray.map((label,index) => (
                                    <div
                                        key={index}
                                        className={`${customRadioButtonClass} ${infoProducts === index ? 'selected' : ''}`}
                                        onClick={() => handleOptionClick((index), setInfoProducts)}
                                    >
                                        {where ==='settings' ? <label>{label}</label> : <h5>{label}</h5>}
                                    </div>

                                ))}
                            </div>
                        </div>
                    </>}

            </div>
        </div>
    );
}
