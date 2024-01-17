
import './Fridge.css';
import {Icon} from "@iconify/react";
import React, {useEffect, useState} from "react";
import {Notifications} from "../Notifications";
import {useLocation} from "react-router-dom";
import '../Notifications.css'
import '../products/ProductItem.css'
import {useProductsData, useProductsDataNoFilter} from "./useProductsData";
import {useProductActions} from "./useProductActions";
import image2 from "../../data/image6.png";
import ProductItem from "./ProductItem";
import Products from "./Products";
import ProductManager from "./ProductManager";
import {ToastContainer} from "react-toastify";


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
            <ToastContainer />
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
                <div className="kontener">
                   <button > <div className="light2">
                        <div  className="box">
                            <div onClick={()=>setSwiatlo(!swiatlo)} className={`bulb2${swiatlo?'.on':''}`}>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                   </button>
                </div>
                <div onClick={handleClick} className={`light-bulb ${bulbIsOn ? 'on' : 'off'} ${bulbPosition(lowWidth, lowHeight) ? '' : 'left'}`}>

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