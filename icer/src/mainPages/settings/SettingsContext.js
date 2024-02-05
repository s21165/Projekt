import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from "axios";
import {API_URL} from "./config";
import {AuthContext} from "../account/auth-context";

//tworzenie kontekstu
const SettingsContext = createContext();

//funkcja odpowiedzialna za dostarczanie ustawień na przestrzeni całej aplikacji
export const SettingsProvider = ({ children }) => {

    //inicjowanie ustawień wielkości elementów na stronie głównej, domyślnie pobierane z localstorage
    const [fridgeSizeElements, setFridgeSizeElements] = useState(localStorage.getItem('fridgeSizeElements') || '');

    //inicjowanie ustawień wielkości elementów na stronie produktów, domyślnie pobierane z localstorage
    const [productsSizeElements, setProductsSizeElements] = useState(localStorage.getItem('productsSizeElements') || '');
    //inicjowanie ustawień informacji na stronie produktów, domyślnie pobierane z localstorage
    const [infoProducts, setInfoProducts] = useState(localStorage.getItem('infoProducts') || '');
    //tablica z nazwami ustawień wielkości elelemntów na stronie lodówki
    const fridgeSizeElementsArray = ['bardzo male', 'male', 'srednie', 'duze', 'bardzo duze'];
    //tablica z nazwami ustawień wielkości elelemntów na stronie produktów
    const productsSizeElementsArray = ['bardzo male', 'male', 'srednie', 'duze', 'bardzo duze']; // Przykładowa tablica

    //pobieranie użytkownika w celu autoryzacji
    const { user } = useContext(AuthContext);
    // wyodrębnienie sesji użytkownika do przesłania do api w ramach autoryzacji
    const sessionId = user ? user.sessionId : null;

    //inicjowanie lokalizacji zdjęcia profilowego, domyślnie pobierane z localstorage
    const [profilePicture,setProfilePicture] = useState(localStorage.getItem('photo'));

    //infomracja czy wyświetlać zdjęcie podstawowe, domyślnie pobierane z localstorage
    const [defaultProfile,setDefaultProfile] = useState(localStorage.getItem('defaultPhoto'));

    //odświeżanie
    const [refresh,setRefresh] = useState(false);
    useEffect(() => {
        if (sessionId) {
            axios.get(`${API_URL}/api/get_user_preferences`, { params: { sessionId } })
                .then((response) => {
                    //przypisywanie wartości zwróconych z api do localstorage i
                    const { wielkosc_lodowki, wielkosc_strony_produktu, widocznosc_informacji_o_produkcie
                    ,lokalizacja_zdj, podstawowe_profilowe} = response.data;
                    updateSetting('fridgeSizeElements', wielkosc_lodowki);
                    updateSetting('productsSizeElements', wielkosc_strony_produktu);
                    updateSetting('infoProducts', widocznosc_informacji_o_produkcie);
                    updateSetting('photo', lokalizacja_zdj);
                    updateSetting('defaultPhoto', podstawowe_profilowe);

                })
                .catch((error) => {
                    console.error(`There was an error retrieving the data: ${error}`);
                });
        }
    }, [sessionId,fridgeSizeElements,productsSizeElements,infoProducts, refresh]);

    const updateSetting = (key, value) => {

        switch (key) {
            case 'fridgeSizeElements':
                setFridgeSizeElements(value);
                break;
            case 'productsSizeElements':
                setProductsSizeElements(value);
                break;
            case 'infoProducts':
                setInfoProducts(value);
                break;
            case 'photo':
                setProfilePicture(value);
                break;
            case 'defaultPhoto':
                setDefaultProfile(value);
                break;
            default:

        }

        localStorage.setItem(key, value);
    };
    const getFridgeSizeIndex = () => {
        return fridgeSizeElementsArray.indexOf(fridgeSizeElements.toLowerCase());
    };

    const getProductsSizeIndex = () => {
        return productsSizeElementsArray.indexOf(productsSizeElements.toLowerCase());
    };


    return (//udostępniaj te wartości na całą aplikację
        <SettingsContext.Provider value={{
            fridgeSizeElements, setFridgeSizeElements,
            productsSizeElements, setProductsSizeElements,
            infoProducts, setInfoProducts, getFridgeSizeIndex,
            getProductsSizeIndex,profilePicture, defaultProfile, refresh,setRefresh
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext;
