import React from 'react';
import '../products/productList/Products.css';
import './Notifications.css'
import {NotificationsList} from "./NotificationsList";
import {useNotificationsData} from "./useNotificationsData";
import {useNotificationActions} from "./useNotificationActions";

//funkcja z powiadomieniami
export function Notifications({small, left}) {
    //tworzy obiekt z aktualnymi danymi pobranymi z API
    const notificationsData = useNotificationsData();
    //tworzy obiekt z możliwymi akcjami na powiadomieniu i przekazuje mu dane o powiadomieniach
    const notificationActions = useNotificationActions(
        notificationsData.data,
        notificationsData.setData,
        notificationsData.sessionId,
        notificationsData.refresh,
        notificationsData.setRefresh,
    );


    return (
        <>  {/* w zależności od wartości wejściowych 'small' oraz 'left' wyświetlaj właściwą listę*/}
            {/* mała lista na stronie głównej*/}
            {small && !left ? <NotificationsList data={notificationsData.data} action={notificationActions} small={true}
                                                 left={true}/> :
                small && left ?
                    <NotificationsList data={notificationsData.data} action={notificationActions} small={true}/> :

                    <> {/* duża lista na stronie powiadomień*/}
                        <div className="notificationListForBig">  {/* kontener z funkcją, która wyświetla listę powiadomień*/}

                            {/* funkcja z listą powiadomień przyjmująca dane z powiadomieniami oraz możliwe akcje na powiadomieniach*/}
                            <NotificationsList data={notificationsData.data} action={notificationActions}/>
                        </div>
                        <div className="spaceBetweenButtonsAndNotifications"></div> {/*element tworzący przestrzeń między kontenerami*/}
                        <div className="manageButtons">  {/* kontener z przyciskami */}
                            <button onClick={notificationActions.handleReadAllNotifications}
                                    className="handleReadAllButton"><h2>odczytaj wszystkie</h2></button>
                            <button onClick={notificationActions.handleRemoveAllNotifications}
                                    className="handleDeleteAllButton"><h2>usuń wszystkie</h2></button>
                        </div>
                    </>}
        </>
    );
}