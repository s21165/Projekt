import React, {useContext, useEffect, useState} from "react";
import {GetBorderStyle} from "./products/GetBorderStyle";
import {NotificationsList} from "./NotificationsList";
import * as PropTypes from "prop-types";
import axios from "axios";
import {AuthContext} from "./account/auth-context";
import './Notifications.css'
import {ShoppingList} from "./ShoppingList";


export function Shopping() {

    const [expandedProduct, setExpandedProduct] = useState(null);
    const [data, setData] = useState(null);
    const { user } = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;

    // Funkcja do przełączania rozwinięcia produktu
    const handleToggleExpand = (productId) => {
        if (expandedProduct === productId) {
            setExpandedProduct(null);
        } else {
            setExpandedProduct(productId);
        }
    }
    useEffect(() => {

        axios.post('http://192.168.0.130:5000/api/shoppingList',{sessionId:sessionId} )
            .then((response) => {
                setData(response.data);


            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    }, []);

    return (
        <>
            <ShoppingList data={data} />

        </>
    );
}