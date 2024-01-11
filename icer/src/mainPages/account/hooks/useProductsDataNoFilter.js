import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../auth-context";
import axios from "axios";
import {API_URL} from "../../../config";

export const useProductsDataNoFilter = () => {
    const { user } = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.post(`${API_URL}/api/Icer`, {sessionId})
            .then((response) => {
                const newData = response.data;
                setData(newData);
            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    }, [data, sessionId]);

    return { data, setData, sessionId };
};