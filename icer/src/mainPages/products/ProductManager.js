import React, {useEffect, useRef, useState} from 'react';
import ProductEdit from "./ProductEdit";
import ProductItem from "./ProductItem";
import {Settings} from "../Settings";
import {Icon} from "@iconify/react";

function ProductManager({
                            editingProduct,
                            productActions,
                            productData,
                            filter,
                            setEditingProduct,
                            setFilter,
                            size

                        }) {
    const [selectedProductId, setSelectedProductId] = useState(null);
    const productListRef = useRef(null); // Utworzenie ref
    const [minDimension, setMinDimension] = useState(0);
    const [dimension,setDimension]=useState({width:0, height:0});
    const rightButtonDivRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    useEffect(() => {
        const observeTarget = productListRef.current;

        if (observeTarget) {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const { width, height } = entry.contentRect;
                    // Ustawienie stanu na większą wartość z width i height
                    setMinDimension(Math.min(width, height));
                    setDimension({width:width,height:height})

                }
            });

            resizeObserver.observe(observeTarget);

            // Czyszczenie przy odmontowywaniu
            return () => resizeObserver.unobserve(observeTarget);
        }
    }, [dimension,minDimension,editingProduct]);

    const handleProductClick = (productId) => {
        setSelectedProductId(selectedProductId === productId ? null : productId);
    };

    return (
        <>
            <div
                ref={sidebarRef}
                className={`settings-container-otherSites ${isSidebarOpen ? 'open' : ''}`}

            >
                <button onClick={toggleSidebar} className={`settings-button`}>
                    <Icon className="settingBurgerButton" icon="iconamoon:menu-burger-vertical-duotone" />
                </button>
                {isSidebarOpen && <Settings where={size === 'small' ? 'fridge' : size === 'medium' ? 'products' : ''}/>}
            </div>
            {editingProduct ? (

                <ProductEdit
                    product={editingProduct}
                    handleEdit={productActions.handleEdit}
                    setEditingProduct={setEditingProduct}
                />
            ) : (
                <>


                    {size === 'medium' &&
                        <>
                            <div>
                                <div className="listButtons">

                                    <div className="leftButtonDiv">
                                        <button
                                            className={`leftButton ${filter === 'current' ? 'active' : ''}`}
                                            onClick={() => setFilter('current')}>
                                            <h2 className="productListTopButtonsH2">aktualne</h2>
                                        </button>
                                    </div>


                                    <div className="rightButtonDiv" ref={rightButtonDivRef}>
                                        <button
                                            className={`rightButton ${filter === 'old' ? 'active' : ''}`}
                                            onClick={() => setFilter('old')}>
                                            <h2 className="productListTopButtonsH2">wyczerpane</h2>
                                        </button>
                                    </div>

                                </div>
                            </div>
                            <div className="spaceBetweenButtonsAndProductList"></div>


                        </>

                    }



                    <div className="productList" ref={productListRef} style={size === 'small' ? {height: "100vh"} : {height: "90vh"}}>
                        {productData.filteredProducts && productData.filteredProducts.map((data, index) =>
                            <ProductItem
                                key={index}
                                data={data}
                                handleRemove={productActions.handleRemove}
                                dimension={dimension}
                                maxDimension={minDimension}
                                handleEditClick={productActions.handleEditClick}
                                handleIncrease={productActions.handleIncrease}
                                handleDecrease={productActions.handleDecrease}
                                handleZero={productActions.handleZero}
                                filter={filter}
                                size={size}
                                rightButtonDivRef={rightButtonDivRef}
                                isSelected={selectedProductId === data.id}
                                isHidden={selectedProductId !== null && selectedProductId !== data.id}
                                setIsSelected={setSelectedProductId}
                                onProductClick={() => handleProductClick(data.id)}

                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default ProductManager;
