import React, {useEffect, useState} from 'react';
import './Products.css';
import ProductEdit from "./ProductEdit";
import ProductItem from "./ProductItem";
import {useProductActions} from './useProductActions';
import {useProductsData} from "./useProductsData";


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
        <>
            {editingProduct ? (
                    <ProductEdit
                        product={editingProduct}
                        handleEdit={productActions.handleEdit}
                        setEditingProduct={setEditingProduct}
                    />
                ) :
                <>
                    <div className="listButtons">
                        <div className="leftButtonDiv">
                            {/* Dodaj warunkową klasę "active" dla przycisku Aktualne */}
                            <button className={`leftButton ${filter === 'current' ? 'active' : ''}`}
                                    onClick={() => setFilter('current')}><h2>Aktualne</h2></button>
                        </div>
                        <div className="rightButtonDiv">
                            {/* Dodaj warunkową klasę "active" dla przycisku Stare */}
                            <button className={`rightButton ${filter === 'old' ? 'active' : ''}`}
                                    onClick={() => setFilter('old')}><h2>Kosz</h2></button>
                        </div>
                    </div>
                    <div className="productList">

                        {productData.filteredProducts && !editingProduct && productData.filteredProducts.map((data, index) =>

                            <ProductItem
                                key={index}
                                data={data}
                                handleRemove={productActions.handleRemove}
                                handleEditClick={productActions.handleEditClick}
                                handleIncrease={productActions.handleIncrease}
                                handleDecrease={productActions.handleDecrease}
                                handleZero={productActions.handleZero}
                                filter={filter}
                                size='medium'
                            />
                        )}
                    </div>
                </>
            }
        </>
    );
}

export default Products;