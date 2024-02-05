import './Fridge.css';
import {Icon} from "@iconify/react";
import React, {useEffect, useState} from "react";
import {Notifications} from "../../notifications/Notifications";
import '../../notifications/Notifications.css'
import '../item/ProductItem.css'
import {useProductsData} from "../API/useProductsData";
import {useProductActions} from "../API/useProductActions";
import ProductManager from "../productList/ProductManager";

import {useNotificationsData} from "../../notifications/useNotificationsData";
import {Link} from "react-router-dom";


//funkcja odpowiedzialna za wyświetlanie komponentu lodówki - pierwszego po zalogowaniu
export function Fridge() {

    //zmienna określająca czy żarówka ma się świecić
    const [bulbIsOn, setbulbIsOn] = useState(true);


    //szerokość okna
    const [lowWidth, setLowWidth] = useState(window.innerWidth);

    //wysokość okna
    const [lowHeight, setLowHeight] = useState(window.innerHeight);

    //obiekt z danymi o produktach z filtrem = 'current'
    const productData = useProductsData("current");

    // wartość określająca czy jest jakiś produkt podcas edycji
    const [editingProduct, setEditingProduct] = useState(null);

    // obiekt posiadający funkcje działań na produktach, przekazujemy mu potrzebne wartości
    const productActions = useProductActions(
        productData.refresh,
        productData.data,
        productData.sessionId,
        productData.setData,
        productData.setRefresh,
        editingProduct,
        setEditingProduct
    );
    // obiekt pobierający dane o powiadomieniach
    const notificationData = useNotificationsData();

    //zmienna określająca czy są jeszcze jakieś nieprzeczytane powiadomienia
    const [hasNotification, setHasNotification] = useState(false);


    useEffect(() => {
        //aktualizujemy wartość hasNotification względem tego czy znajduje się tam jeszcze jakieś nieprzeczytane powiadomienie
        const hasNotif = notificationData.data?.some(product => product.powiadomienie === 1);
        setHasNotification(hasNotif);


    }, [notificationData.data]);//odświeża się po zmianie danych powiadomienia

    //po naciśnięciu na lampkę przestaje się świecić i wyświetla listę powiadomień
    const handleClick = () => {
        setbulbIsOn(!bulbIsOn);
    }

    useEffect(() => {

        //przypisuje aktualne wartości wysokości i szerokości okna do zmiennych
        const handleResize = () => {
            setLowWidth(window.innerWidth);
            setLowHeight(window.innerHeight);

        };

        //ustawia nasłuchiwanie na wartości zmiany wielkości
        window.addEventListener('resize', handleResize);

        return () => {
            //usuwa nasłuchiwanie na wartości zmiany wielkości
            window.removeEventListener('resize', handleResize);
            //dodaje wartości do funkcji
            bulbPosition(lowWidth, lowHeight)
        };

    }, [lowHeight, lowWidth, productActions, productData]); // odświeża się po zmianie wartości


    //funkcja która określa po której stronie ma być lampka, po lewej stronie jak szerokość jest mniejsza od 1000px bądź
    //wysokość jest mniejsza od 800px.
    const bulbPosition = (lowWidth, lowHeight) => {

        return !(lowWidth < 1000 || lowHeight < 800);
    }

    return (
        /*główny kontener lodówki*/
        <div className="fridgeContainer">
            {/*wewnętrzny kontener lodówki*/}
            <div className="fridge">

                {/*lista produktów na stronie lodówki*/}
                <div className="fridgeList">
                    {/*wywołujemy funkcję ProductManager, do której przekazujemy wartości */}
                    <ProductManager
                        editingProduct={editingProduct}
                        productActions={productActions}
                        productData={productData}
                        filter={"current"} //ustawiamy filtr na aktualne produkty (te, których ilość jest większa niż 0)
                        setEditingProduct={setEditingProduct}
                        size={"small"} //przekazujemy wielkość elementów na stronie - wielkość small określa elementy,
                        //które są na stronie lodówki
                    />
                </div>
                {/* kontener, który gazi lampkę i wyświetla powiadomienia przy lampce */}
                <div onClick={handleClick}
                     className={`light-bulb ${hasNotification ? 'on' : 'off'} ${bulbPosition(lowWidth, lowHeight) ? '' : 'left'}`}>
                    {/*ikona lampki*/}
                    <Icon className="bulb" icon="mdi:lightbulb-on-outline"/>
                    {/*światło*/}
                    <div className="light">
                    </div>

                </div>
                {/*wyświetla powiadomienia, jeśli lampka nie jest zapalona, względem pozycji żarówki*/}
                {!bulbIsOn && bulbPosition(lowWidth, lowHeight) && <Notifications small left/>}
                {!bulbIsOn && !bulbPosition(lowWidth, lowHeight) && <Notifications small/>}
                <div/>


            </div>

        </div>
    );
}
