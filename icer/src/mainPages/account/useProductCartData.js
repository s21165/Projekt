import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "../../config";
import {AuthContext} from "./auth-context";

export const useProductCartData = () =>{
    const { user } = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;
    const [data, setData] = useState(null);

useEffect(() => {

    axios.post(`${API_URL}/api/shoppingList`,{sessionId:sessionId} )
        .then((response) => {
            setData(response.data);
            console.log(data);

        })
        .catch((error) => {
            console.error(`There was an error retrieving the data: ${error}`);
        });
}, [data]);

    return{ data, setData}
}