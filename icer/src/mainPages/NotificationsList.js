import {useState} from "react";
import {GetBorderStyle} from "./products/GetBorderStyle";
import {Icon} from "@iconify/react";

export function NotificationsList({data, small = false, action, left = false}) {

    const [expandedProduct, setExpandedProduct] = useState(null);
    const styl = GetBorderStyle(data, "current", 4);
    // Funkcja do przełączania rozwinięcia produktu
    const handleToggleExpand = (productId) => {
        if (expandedProduct === productId) {
            setExpandedProduct(null);
        } else {
            setExpandedProduct(productId);
        }
    }

    const handleAlertClick = (productId) => {
        // Logika obsługi alertu
    };

    const handleDeleteClick = (productId) => {
        // Logika usuwania powiadomienia
    };
    const handleNotificationClick = (productId) => {
        // Only mark notification as read if it's not currently expanded
        if (expandedProduct !== productId) {
            action.handleReadNotification(productId);
        }
        handleToggleExpand(productId);
    };

    const selectAlertColor = (notification) => {
        switch (notification) {
            case 0:
                return 'black'; // example ratio
            case 1:
                return 'red';
            default:
                return 'black'; // default font size if none of the cases match
        }
    }

    return (

        <>
            <div className={`notificationsList ${small ? "small" : ""} ${left ? "left" : ""}`}>


                {data && data.map(product => (

                    <div className={"notificationProductDiv"} key={product.id} style={{border: styl}}


                    >

                        <div
                            className="notificationsNameDiv"

                        >
                            <h5 className="notificationText"
                                onClick={() => {
                                    handleNotificationClick(product.id)
                                }}
                            >{product.nazwa}</h5>
                            <div className="notificationIcons"


                            >
                                <div className="notificationAlertIconDiv">
                                    <Icon className="notificationAlertIcon"
                                          style={
                                              small
                                                  ? {
                                                      marginRight: "1vw",
                                                      height: "2vh",
                                                      width: "2vw",
                                                      color: selectAlertColor(product.powiadomienie)
                                                  }
                                                  : {marginRight: "3vw", color: selectAlertColor(product.powiadomienie)}
                                          }

                                          icon="fluent:alert-16-regular"
                                          onClick={() => {
                                              handleAlertClick(product.id)
                                              action.handleReadNotification(product.id)
                                          }}
                                    />
                                </div>
                                <div className="notificationDeleteIconDiv">
                                    <Icon className="notificationDeleteIcon"
                                          style={small ? {
                                              marginRight: "1vw",
                                              height: "2vh",
                                              width: "2vw"
                                          } : {marginRight: "3vw"}}
                                          icon="octicon:x-24"
                                          onClick={() => action.handleRemoveNotification(product.id)}/>
                                </div>
                            </div>

                        </div>

                        <div className={`notificationsProductInfo ${expandedProduct === product.id ? "expanded" : ""}`}
                             style={small ? {backgroundColor: "rgba(255, 255, 255, 0.5)"} : {backgroundColor: "#deeffc"}}

                        >
                            <div className="notificationsContent"
                                 style={small ? {marginRight: 0} : {marginRight: "12vw"}}

                            >
                                {expandedProduct === product.id && (
                                    <>
                                        <p>Data
                                            ważności: {new Date(product.data_waznosci).toISOString().split('T')[0]}</p>
                                        <p>Ilość: {product.ilosc}</p>
                                        <p>Cena: {product.cena}</p>
                                        <p>Kalorie: {product.kalorie}</p>
                                        <p>Tłuszcze: {product.tluszcze}</p>
                                        <p>Węglowodany: {product.weglowodany}</p>
                                        <p>Białko: {product.bialko}</p>
                                        <p>Kategoria: {product.kategoria}</p>
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                ))}

            </div>

        </>
    );
}