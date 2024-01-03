import React, {useState} from 'react';
import ProductEdit from "./ProductEdit";
import ProductItem from "./ProductItem";

function ProductManager({
                            editingProduct,
                            productActions,
                            productData,
                            filter,
                            setEditingProduct,
                            setFilter,
                            size,

                        }) {


    const [selectedProductId, setSelectedProductId] = useState(null);
    const handleProductClick = (productId) => {
        setSelectedProductId(selectedProductId === productId ? null : productId);
    };
    return (
        <>
            {editingProduct ? (
                <ProductEdit
                    product={editingProduct}
                    handleEdit={productActions.handleEdit}
                    setEditingProduct={setEditingProduct}
                />
            ) : (
                <>
                    {size==='medium' && <div className="listButtons">
                        <div className="leftButtonDiv">
                            <button
                                className={`leftButton ${filter === 'current' ? 'active' : ''}`}
                                onClick={() => setFilter('current')}>
                                <h2>Aktualne</h2>
                            </button>
                        </div>
                        <div className="rightButtonDiv">
                            <button
                                className={`rightButton ${filter === 'old' ? 'active' : ''}`}
                                onClick={() => setFilter('old')}>
                                <h2>Kosz</h2>
                            </button>
                        </div>
                    </div>
                    }
                    <div className="productList">
                        {productData.filteredProducts && productData.filteredProducts.map((data, index) =>
                            <ProductItem
                                key={index}
                                data={data}
                                handleRemove={productActions.handleRemove}
                                handleEditClick={productActions.handleEditClick}
                                handleIncrease={productActions.handleIncrease}
                                handleDecrease={productActions.handleDecrease}
                                handleZero={productActions.handleZero}
                                filter={filter}
                                size={size}
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
