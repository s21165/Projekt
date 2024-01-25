import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import '../products/productList/Products.css';
import ProductEdit from "../products/edit/ProductEdit";
import ProductItem from "../products/item/ProductItem";
import './Notifications.css'
import {NotificationsList} from "./NotificationsList";
import {AuthContext} from "../account/auth-context";
import {GetBorderStyle} from "../products/item/GetBorderStyle";
import {API_URL} from "../settings/config";

import {useNotificationsData} from "./useNotificationsData";
import {useNotificationActions} from "./useNotificationActions";



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
        notificationsData.setRefresh,

    );



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
                            <button onClick={notificationActions.handleReadAllNotifications} className="handleReadAllButton"><h2>Odczytaj wszystkie</h2></button>
                            <button onClick={notificationActions.handleRemoveAllNotifications} className="handleDeleteAllButton"><h2>Usuń wszystkie</h2></button>
                        </div>
                    </>}
        </>
    );
}