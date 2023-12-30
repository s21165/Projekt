import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Products.css';

import ProductEdit from "./ProductEdit";
import ProductItem from "./ProductItem";
import { useContext } from 'react';
import { AuthContext } from '../account/auth-context';
import {API_URL} from "../../config";
import { useProductActions } from './useProductActions';


function Products() {

    const { user } = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;
    const username = user ? user.username : null;
    const [data, setData] = useState(null);
    const [filter, setFilter] = useState('current');
    const [decrease,setDecrease] = useState(1)
    const [filteredProducts,setFilteredProducts] = useState(null)

    const [refresh, setRefresh] = useState(false); // Dodajemy stan do odświeżania ekranu
    const [editingProduct, setEditingProduct] = useState(null);
    const productActions = useProductActions(refresh,data,sessionId, setData, setRefresh);


    const handleEditClick = (product) => {
        setEditingProduct({
            id: product.id,
            nazwa: product.nazwa,
            cena: product.cena,
            kalorie: product.kalorie,
            tluszcze: product.tluszcze,
            weglowodany: product.weglowodany,
            bialko: product.bialko,
            kategoria: product.kategoria,
            ilosc: product.ilosc,
            data_waznosci: new Date(product.data_waznosci).toISOString().split('T')[0]
        });
    };
    const handleEdit = () => {
        const id = editingProduct.id;
        const config = {
            headers: {
                'Content-Type': 'application/json', // informuje serwer, że dane wysyłane w żądaniu są w formacie JSON.
                'session_id': sessionId

            },
        };

        axios
            .put(`${API_URL}/api/edit_product/${id}`, editingProduct, config)
            .then((response) => {
                console.log(response.data);
                setEditingProduct(null);
                setRefresh(!refresh);
            })
            .catch((error) => {
                console.error(`There was an error updating the product: ${error}`);
            });
    };

    useEffect(() => {
        setEditingProduct(null);

        axios.post(`${API_URL}/api/Icer`, {sessionId: sessionId})
            .then((response) => {
                const newData = response.data;
                setData(newData);  // aktualizujesz stan 'data'
                console.log(response.data);
                // Teraz filtrujesz bezpośrednio 'newData'
                const newFilteredProducts = newData.filter(product => {
                    if (filter === 'current') {
                        return product.ilosc > 0;
                    } else if (filter === 'old') {
                        return product.ilosc === 0;
                    } else {
                        return true; // domyślnie zwraca wszystkie produkty
                    }
                });
                setFilteredProducts(newFilteredProducts);  // aktualizujesz stan 'filteredProducts'
            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    }, [refresh, filter, sessionId, setEditingProduct, setData, setFilteredProducts]);


    return (
        <>
            {editingProduct ? (
                <ProductEdit
                    product={editingProduct}
                    handleEdit={handleEdit}
                    setEditingProduct={setEditingProduct}
                />
            ):
                <>
            <div className="listButtons">
                <div className="leftButtonDiv">
                    {/* Dodaj warunkową klasę "active" dla przycisku Aktualne */}
                    <button className={`leftButton ${filter === 'current' ? 'active' : ''}`} onClick={() => setFilter('current')}><h2>Aktualne</h2></button>
                </div>
                <div className="rightButtonDiv">
                    {/* Dodaj warunkową klasę "active" dla przycisku Stare */}
                    <button className={`rightButton ${filter === 'old' ? 'active' : ''}`} onClick={() => setFilter('old')}><h2>Kosz</h2></button>
                </div>
            </div>
            <div className="productList">

                {filteredProducts  && !editingProduct && filteredProducts.map((data, index) =>

                <ProductItem
                    key={index}
                    data={data}
                    handleRemove={productActions.handleRemove}
                    handleEditClick={handleEditClick}
                    handleIncrease={productActions.handleIncrease}
                    handleDecrease={productActions.handleDecrease}
                    handleZero={productActions.handleZero}
                    filter={filter}

                />
            )}
            </div>
                </>
            }
        </>
    );
}
export default Products;