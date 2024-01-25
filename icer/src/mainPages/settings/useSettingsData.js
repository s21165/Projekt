import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "./config";
import {AuthContext} from "../account/auth-context";

export const useSettingsData = (preferences) =>{
    const { user } = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;
    const [data, setData] = useState(null);

    useEffect(() => {

        axios.post(`${API_URL}/api/update_preferences`,{sessionId:sessionId} )
            .then((response) => {
                setData(response.data);

            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    }, [data]);

    return{ data, setData,user, sessionId}
}