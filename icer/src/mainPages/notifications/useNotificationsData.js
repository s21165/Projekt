import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { API_URL } from "../settings/config";
import {AuthContext} from "../account/auth-context";

export const useNotificationsData = () => {
    const { user } = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;
    const [data, setData] = useState(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        axios.post(`${API_URL}/api/Icer/get_notifications`, {sessionId})
            .then((response) => {
                const newData = response.data;
                setData(newData);
                setRefresh(!refresh);

            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    }, [data,refresh, sessionId, setData]);

    return { data, setData, sessionId, refresh, setRefresh };
};
