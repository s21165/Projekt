import React, {useEffect, useState} from 'react';
import './Products.css';
import ProductEdit from "./ProductEdit";
import ProductItem from "./ProductItem";
import {useProductActions} from './useProductActions';
import {useProductsData} from "./useProductsData";
import ProductManager from "./ProductManager";


function Products() {


    const [filter, setFilter] = useState('current');

    const productData = useProductsData(filter)
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



    return (
        <ProductManager
            editingProduct={editingProduct}
            productActions={productActions}
            productData={productData}
            filter={filter}
            setEditingProduct={setEditingProduct}
            setFilter={setFilter}
            size={"medium"}
        />
    );

}

export default Products;