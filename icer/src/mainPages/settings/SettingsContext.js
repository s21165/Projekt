import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from "axios";
import {API_URL} from "./config";
import {AuthContext} from "../account/auth-context";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [fridgeSizeElements, setFridgeSizeElements] = useState(localStorage.getItem('fridgeSizeElements') || '');
    const [productsSizeElements, setProductsSizeElements] = useState(localStorage.getItem('productsSizeElements') || '');
    const [infoProducts, setInfoProducts] = useState(localStorage.getItem('infoProducts') || '');
    const fridgeSizeElementsArray = ['bardzo male', 'male', 'srednie', 'duze', 'bardzo duze'];
    const productsSizeElementsArray = ['bardzo male', 'male', 'srednie', 'duze', 'bardzo duze']; // Przykładowa tablica
    const { user } = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;
    const [profilePicture,setProfilePicture] = useState(localStorage.getItem('photo'));
    const [defaultProfile,setDefaultProfile] = useState(localStorage.getItem('defaultPhoto'));
    const [refresh,setRefresh] = useState(false);
    useEffect(() => {
        if (sessionId) {
            axios.get(`${API_URL}/api/get_user_preferences`, { params: { sessionId } })
                .then((response) => {

                    const { wielkosc_lodowki, wielkosc_strony_produktu, widocznosc_informacji_o_produkcie
                    ,profile_photo, podstawowe_profilowe} = response.data;
                    updateSetting('fridgeSizeElements', wielkosc_lodowki);
                    updateSetting('productsSizeElements', wielkosc_strony_produktu);
                    updateSetting('infoProducts', widocznosc_informacji_o_produkcie);
                    updateSetting('photo', profile_photo);
                    updateSetting('defaultPhoto', podstawowe_profilowe);
                    console.log(profile_photo)
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
            // Handle unknown keys
        }
        localStorage.setItem(key, value);
    };
    const getFridgeSizeIndex = () => {
        return fridgeSizeElementsArray.indexOf(fridgeSizeElements.toLowerCase());
    };

    const getProductsSizeIndex = () => {
        return productsSizeElementsArray.indexOf(productsSizeElements.toLowerCase());
    };


    return (
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
