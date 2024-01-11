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
import {useProductsDataNoFilter} from "./account/hooks/useProductsDataNoFilter";
import {useNotificationsData} from "./products/useNotificationsData";
import {useNotificationActions} from "./products/useNotificationActions";



export function Notifications({small, left}) {
    const [data, setData] = useState(null);
    const {user} = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;
    const notificationsData = useNotificationsData();

    const notificationActions = useNotificationActions(
        notificationsData.data,
        notificationsData.setData,
        notificationsData.sessionId,
        notificationsData.refresh,
        notificationsData.setRefresh
    );

    // const notificationsData = useNotificationsData();
    function handleReadAll() {

    }

    function handleDeleteAll() {

    }


    return (
        <>
            {small && !left ? <NotificationsList data={notificationsData.data} action={notificationActions} small={true} left={true}/> :
                small && left ? <NotificationsList data={notificationsData.data} action={notificationActions} small={true}/> :
                    <>
                        <div className="notificationListForBig">
                            <NotificationsList data={notificationsData.data} action={notificationActions} />
                        </div>
                        <div className="spaceBetweenButtonsAndNotifications"></div>
                        <div className="manageButtons">
                            <button onClick={handleReadAll} className="handleReadAllButton"><h2>Odczytaj wszystkie</h2></button>
                            <button onClick={notificationActions.handleRemoveAllNotifications} className="handleDeleteAllButton"><h2>Usuń wszystkie</h2></button>
                        </div>
                    </>}
        </>
    );
}