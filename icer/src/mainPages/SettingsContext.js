import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "./account/auth-context";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [fridgeSizeElements, setFridgeSizeElements] = useState(localStorage.getItem('fridgeSizeElements') || '');
    const [productsSizeElements, setProductsSizeElements] = useState(localStorage.getItem('productsSizeElements') || '');
    const [infoProducts, setInfoProducts] = useState(localStorage.getItem('infoProducts') || '');

    const { user } = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;

    useEffect(() => {
        if (sessionId) {
            axios.get(`${API_URL}/api/get_user_preferences`, { params: { sessionId } })
                .then((response) => {
                    const { wielkosc_lodowki, wielkosc_strony_produktu, widocznosc_informacji_o_produkcie } = response.data;
                    updateSetting('fridgeSizeElements', wielkosc_lodowki);
                    updateSetting('productsSizeElements', wielkosc_strony_produktu);
                    updateSetting('infoProducts', widocznosc_informacji_o_produkcie);
                })
                .catch((error) => {
                    console.error(`There was an error retrieving the data: ${error}`);
                });
        }
    }, [sessionId]);

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
            default:
            // Handle unknown keys
        }
        localStorage.setItem(key, value);
    };

    return (
        <SettingsContext.Provider value={{
            fridgeSizeElements, setFridgeSizeElements: (value) => updateSetting('fridgeSizeElements', value),
            productsSizeElements, setProductsSizeElements: (value) => updateSetting('productsSizeElements', value),
            infoProducts, setInfoProducts: (value) => updateSetting('infoProducts', value)
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext;
