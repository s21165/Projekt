import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "./config";
import './Settings.css'
import {AuthContext} from "../account/auth-context";
import SettingsContext from "./SettingsContext";

//funkcja od ustawień, przyjmuje informacje gdzie ma zostać wyświetlana
export function Settings({where}) {

    //pobiera usera w ramach autoryzacji
    const { user } = useContext(AuthContext);
    // wyodrębnienie sesji użytkownika do przesłania do api w ramach autoryzacji
    const sessionId = user ? user.sessionId : null;
    //pobieranie wartości ustawień z kontekstu ustawień
    const { fridgeSizeElements, setFridgeSizeElements, productsSizeElements, setProductsSizeElements, infoProducts, setInfoProducts } = useContext(SettingsContext);
    //zmienna odpowiedzialna za odświeżanie
    const [refresh,setRefresh] = useState(false);
    //tablica z nazwami ustawień wielkości elelemntów na stronie lodówki
    const fridgeSizeElementsArray = ['bardzo małe', 'małe', 'średnie', 'duże', 'bardzo duże'];

    //funkcja, która wybieraja aktualne ustawienie i odświeża
    const handleOptionClick = (optionValue, setter) => {

        setter(optionValue);
        setRefresh(!refresh);
    };
    // Nazwy dla drugiej grupy opcji
    const productsSizeElementsArray = ['bardzo małe', 'małe', 'średnie', 'duże', 'bardzo duże'];

    //tablica z nazwami ustawień pokazywania informacji o produkcie
    const infoProductsArray = ['nie','tak'];

    //zmienna posiadająca klasy zależne od wartości gdzie elementy mają być wyświetlane
    const sectionHeaderClass = `settings-sectionHeader ${
            
    where === 'products' ||  where === 'fridge'   ? 'settings-sectionHeader--products' : ''
    }`;
    //zmienna posiadająca klasy zależne od wartości gdzie elementy mają być wyświetlane
    const customRadioButtonClass = `custom-radio-button ${

        (where === 'products' ||  where === 'fridge')   ? 'custom-radio-button--products' : ''
    }`;
    //zmienna posiadająca klasy zależne od wartości gdzie elementy mają być wyświetlane
    const settingsDivClass = `settingsDiv ${
            where === 'products' ||  where === 'fridge'   ? 'settingsDiv--products' : ''
    }`;

    useEffect(() => {
        //przypisuje ustawienia do wartości wysyłanych do API
        const preferences = {
            wielkosc_lodowki: fridgeSizeElements,
            wielkosc_strony_produktu:productsSizeElements,
            widocznosc_informacji_o_produkcie: infoProducts
        };

        axios.post(`${API_URL}/api/update_preferences`, { ...preferences, sessionId })
            .then((response) => {

            })
            .catch((error) => {
                console.error('Error updating preferences:', error);
            });
    },[refresh,sessionId]);

    //hook do wybierania ustawień, podajemy pozycję w tablicy nazewnictwa
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

                        {/*mapujemy możliwe ustawienia lodówki*/}
                        {fridgeSizeElementsArray.map((label, index) => (
                            <div
                                key={label}
                                className={`${customRadioButtonClass} ${fridgeSizeElements === mapSizeToApiValue(index) ? 'selected' : ''}`}
                                //przy naciśnięciu ma się ustawiać wybrana opcja
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

                                {/*mapujemy możliwe ustawienia dla wielkości produktów w podstronie produktów*/}
                                {productsSizeElementsArray.map((label,index) => (
                                    <div
                                        key={label}
                                        className={`${customRadioButtonClass} ${productsSizeElements === mapSizeToApiValue(index) ? 'selected' : ''}`}
                                        //przy naciśnięciu ma się ustawiać wybrana opcja
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
                                {/*mapujemy możliwe ustawienia informacji o produktach */}
                                {infoProductsArray.map((label,index) => (
                                    <div
                                        key={index}
                                        className={`${customRadioButtonClass} ${infoProducts === index ? 'selected' : ''}`}
                                        //przy naciśnięciu ma się ustawiać wybrana opcja
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
