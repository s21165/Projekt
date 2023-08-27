
import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import './products/Products.css';
import ProductEdit from "./products/ProductEdit";
import ProductItem from "./products/ProductItem";
import './Notifications.css'
import {NotificationsList} from "./NotificationsList";
import {AuthContext} from "./account/auth-context";
import {GetBorderStyle} from "./products/GetBorderStyle";
import {API_URL} from "../config";



export function Notifications( { small }) {
    const [data, setData] = useState(null);
    const { user } = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;

    useEffect(() => {

        axios.post(`${API_URL}/api/Icer`,{sessionId:sessionId} )
            .then((response) => {
                setData(response.data);


            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    }, []);



    return (
        <>
            {small ?  <NotificationsList data={data} small={true}/> : <NotificationsList data={data} />}
        </>
    );
};