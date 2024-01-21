import React, {useEffect, useRef, useState} from 'react';
import './Products.css';
import ProductEdit from "./ProductEdit";
import ProductItem from "./ProductItem";
import {useProductActions} from './useProductActions';
import {useProductsData} from "./useProductsData";
import ProductManager from "./ProductManager";
import {ToastContainer} from "react-toastify";
import {Icon} from "@iconify/react";
import {Settings} from "../Settings";


function Products() {


    const [filter, setFilter] = useState('current');

    const productData = useProductsData(filter);
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

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleDrag = (e) => {
        const sidebar = sidebarRef.current;
        if (sidebar) {
            const newWidth = Math.max(e.clientX, 150); // Minimalna szerokość
            sidebar.style.width = `${newWidth}px`;
        }
    };
    const handleDragEnd = (e) => {
        const threshold = 300; // Prog otwarcia
        const newWidth = e.clientX;
        if (newWidth < threshold) {
            setIsSidebarOpen(false);
        } else {
            setIsSidebarOpen(true);
        }
    };


    return (<>
        <ToastContainer />
            {/*<div*/}
            {/*    ref={sidebarRef}*/}
            {/*    className={`settings-container-otherSites ${isSidebarOpen ? 'open' : ''}`}*/}
            {/*>*/}
            {/*    <button onClick={toggleSidebar} className={`settings-button`}>*/}
            {/*        <Icon className="settingBurgerButton" icon="iconamoon:menu-burger-vertical-duotone" />*/}
            {/*    </button>*/}
            {/*    {isSidebarOpen && <Settings where='medium'/>}*/}
            {/*</div>*/}
        <ProductManager
            editingProduct={editingProduct}
            productActions={productActions}
            productData={productData}
            filter={filter}
            setEditingProduct={setEditingProduct}
            setFilter={setFilter}
            size={"medium"}
        />
        </>
    );

}

export default Products;