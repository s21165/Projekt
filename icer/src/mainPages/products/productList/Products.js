import React, {useState} from 'react';
import './Products.css';
import {useProductActions} from '../API/useProductActions';
import {useProductsData} from "../API/useProductsData";
import ProductManager from "./ProductManager";


//funkcja odpowiedzialna za produkty
function Products() {

    //ustawianie filtra
    const [filter, setFilter] = useState('current');

    //tworzenie obiektu z danymi z produktami
    const productData = useProductsData(filter);
    //tworznie zmiennej oznaczającej czy jest produkt, który jest edytowany
    const [editingProduct, setEditingProduct] = useState(null);
    //tworzenie obiektu z możliwymi akcjami na produkcie
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
            {/*zwróć funkcję ProductManager i przekaż mu wartości*/ }
            <ProductManager
                editingProduct={editingProduct}
                productActions={productActions}
                productData={productData}
                filter={filter}
                setEditingProduct={setEditingProduct}
                setFilter={setFilter}
                size={"medium"} //ustawianie wartości dla elementu będącego na stronie produktów
            />
        </>
    );

}

export default Products;