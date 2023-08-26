
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './products/Products.css';
import ProductEdit from "./products/ProductEdit";
import ProductItem from "./products/ProductItem";
import './Notifications.css'
import {NotificationsList} from "./NotificationsList";
export function Notifications( { small }) {
    const [data, setData] = useState(null);

    useEffect(() => {

        axios.get('http://localhost:5000/api/products')
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