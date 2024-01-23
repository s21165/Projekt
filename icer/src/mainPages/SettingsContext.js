import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from "axios";
import {API_URL} from "../config";
import {AuthContext} from "./account/auth-context";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [fridgeSizeElements, setFridgeSizeElements] = useState('');
    const [productsSizeElements, setProductsSizeElements] = useState('');
    const [infoProducts, setInfoProducts] = useState('');

    const {user} = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;

    useEffect(() => {
        const savedFridgeSize = localStorage.getItem('fridgeSizeElements');
        const savedProductSize = localStorage.getItem('productsSizeElements');
        const savedInfoProducts = localStorage.getItem('infoProducts');

        if (savedFridgeSize) setFridgeSizeElements(savedFridgeSize);
        if (savedProductSize) setProductsSizeElements(savedProductSize);
        if (savedInfoProducts) setInfoProducts(savedInfoProducts);
        if (sessionId) {
            axios.get(`${API_URL}/api/get_user_preferences`, { params: { sessionId } })
                .then((response) => {
                    const { wielkosc_lodowki, wielkosc_strony_produktu, widocznosc_informacji_o_produkcie } = response.data;
                    setFridgeSizeElements(wielkosc_lodowki);
                    setProductsSizeElements(wielkosc_strony_produktu);
                    setInfoProducts(widocznosc_informacji_o_produkcie);

                })
                .catch((error) => {
                    console.error(`There was an error retrieving the data: ${error}`);
                });
        }
    }, [sessionId]);





    return (
        <SettingsContext.Provider value={{ fridgeSizeElements, setFridgeSizeElements, productsSizeElements, setProductsSizeElements, infoProducts, setInfoProducts }}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext;