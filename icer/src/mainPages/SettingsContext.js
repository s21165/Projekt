import React, { createContext, useState } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [fridgeSizeElements, setFridgeSizeElements] = useState(4);
    const [productsSizeElements, setProductsSizeElements] = useState(2);
    const [infoProducts, setInfoProducts] = useState(1);

    return (
        <SettingsContext.Provider value={{ fridgeSizeElements, setFridgeSizeElements, productsSizeElements, setProductsSizeElements, infoProducts, setInfoProducts }}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext;