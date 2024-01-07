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
import {useProductsDataNoFilter} from "./products/useProductsData";


export function Notifications({small, left}) {
    const [data, setData] = useState(null);
    const {user} = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;
    const productDataNoFilter = useProductsDataNoFilter();
    // const notificationsData = useNotificationsData();
    function handleReadAll() {

    }

    function handleDeleteAll() {

    }


    return (
        <>
            {small && !left ? <NotificationsList data={productDataNoFilter.data} small={true} left={true}/> :
                small && left ? <NotificationsList data={productDataNoFilter.data} small={true}/> :
                    <>
                        <div className="notificationListForBig">
                            <NotificationsList data={productDataNoFilter.data}/>
                        </div>
                        <div className="spaceBetweenButtonsAndNotifications"></div>
                        <div className="manageButtons">
                            <button onClick={handleReadAll} className="handleReadAllButton"><h2>Odczytaj wszystkie</h2></button>
                            <button onClick={handleDeleteAll} className="handleDeleteAllButton"><h2>Usuń wszystkie</h2></button>
                        </div>
                    </>}
        </>
    );
}