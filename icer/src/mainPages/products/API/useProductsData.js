import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { API_URL } from "../../settings/config";
import {AuthContext} from "../../account/auth-context";

export const useProductsData = ( filter) => {
    const { user } = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;
    const [data, setData] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        axios.post(`${API_URL}/api/Icer`, {sessionId})
            .then((response) => {
                const newData = response.data;
                setData(newData);
                const newFilteredProducts = newData.filter(product => {
                    if (filter === 'current') {
                        return product.ilosc > 0;
                    } else if (filter === 'old') {
                        return product.ilosc === 0;
                    }
                    return true;
                });
                setFilteredProducts(newFilteredProducts);
                
            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    }, [data,refresh, filter, sessionId]);

    return { data, setData, sessionId, filteredProducts, refresh, setRefresh };
};


