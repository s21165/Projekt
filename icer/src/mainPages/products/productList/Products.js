import React, {useEffect, useRef, useState} from 'react';
import './Products.css';
import ProductEdit from "../edit/ProductEdit";
import ProductItem from "../item/ProductItem";
import {useProductActions} from '../API/useProductActions';
import {useProductsData} from "../API/useProductsData";
import ProductManager from "./ProductManager";
import {ToastContainer} from "react-toastify";
import {Icon} from "@iconify/react";
import {Settings} from "../../settings/Settings";


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

    return (<>
        <ToastContainer />

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