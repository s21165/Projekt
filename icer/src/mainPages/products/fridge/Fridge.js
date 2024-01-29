
import './Fridge.css';
import {Icon} from "@iconify/react";
import React, {useEffect, useState} from "react";
import {Notifications} from "../../notifications/Notifications";
import {useLocation} from "react-router-dom";
import '../../notifications/Notifications.css'
import '../item/ProductItem.css'
import {useProductsData, useProductsDataNoFilter} from "../API/useProductsData";
import {useProductActions} from "../API/useProductActions";
import image2 from "../../../data/image6.png";
import ProductItem from "../item/ProductItem";
import Products from "../productList/Products";
import ProductManager from "../productList/ProductManager";

import {useNotificationsData} from "../../notifications/useNotificationsData";


export function Fridge(){
    const [bulbIsOn, setbulbIsOn] = useState(true);
    const [lowWidth, setLowWidth] = useState(window.innerWidth);
    const [lowHeight, setLowHeight] = useState(window.innerHeight);
    const productData = useProductsData("current");
    const [swiatlo,setSwiatlo]=useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const productActions = useProductActions(
        productData.refresh,
        productData.data,
        productData.sessionId,
        productData.setData,
        productData.setRefresh,
        editingProduct,
        setEditingProduct
    );
    const notificationData = useNotificationsData();
    const [hasNotification, setHasNotification] = useState(false);

    useEffect(() => {

        const hasNotif = notificationData.data?.some(product => product.powiadomienie === 1 );
        setHasNotification(hasNotif);



    }, [notificationData.data]);
    const  handleClick = ()=> {
        setbulbIsOn(!bulbIsOn);
    }

    useEffect(() => {
        const handleResize = () => {
            setLowWidth(window.innerWidth);
            setLowHeight(window.innerHeight);

        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            bulbPosition(lowWidth, lowHeight)
        };

    }, [lowHeight, lowWidth,productActions]);

    const bulbPosition =( lowWidth, lowHeight) =>{

        return !(lowWidth < 1000 || lowHeight < 800);
    }

    return(
        <div className="fridgeContainer">

            <div className="fridge">


                <div className="fridgeList">

                        <ProductManager
                            editingProduct={editingProduct}
                            productActions={productActions}
                            productData={productData}
                            filter={"current"}
                            setEditingProduct={setEditingProduct}
                            setFilter={"current"}
                            size={"small"}
                        />
                </div>

                <div onClick={handleClick} className={`light-bulb ${hasNotification ? 'on' : 'off'} ${bulbPosition(lowWidth, lowHeight) ? '' : 'left'}`}>

                    <Icon className="bulb" icon="mdi:lightbulb-on-outline" />
                    <div className="light">
                    </div>

                </div>

                {!bulbIsOn &&  bulbPosition(lowWidth, lowHeight) && <Notifications small left/>}
                { !bulbIsOn &&  !bulbPosition(lowWidth, lowHeight) && <Notifications small />}
                <div/>


            </div>

        </div>
    );
}
