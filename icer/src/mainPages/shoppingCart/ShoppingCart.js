import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {ShoppingList} from "./ShoppingList";
import "./ShoppingList.css"
import {API_URL} from "../settings/config";
import {useProductCartData} from "./useProductCartData";
import {Icon} from "@iconify/react";
import {useShoppingCartActions} from "./useShoppingCartActions";

export function ShoppingCart() {

    const productDataCart = useProductCartData();
    const [showNewFields, setShowNewFields] = useState(false);
    const [newFields, setNewFields] = useState([]);
    const shoppingCartActions = useShoppingCartActions();

    const addNewField = () => {
        if (showNewFields) {
            setNewFields([]); // Usuń pole, jeśli już istnieje
        } else {
            setNewFields([{nazwa: '', ilosc: 0, cena: 0}]); // Dodaj nowe pole
        }
        setShowNewFields(!showNewFields);
    };


    return (

        <>
            <div className="handleAddToCartButtonDiv">

                <button className="handleAddAllCartButton" onClick={addNewField}>{showNewFields ?
                    <h2>cofnij dodawanie</h2> : <h2>dodaj</h2>}</button>

            </div>
            <div className="topInfoShoppingCart">
                <h2 className="topInfoShoppingListName">nazwa</h2>
                <h2 className="topInfoShoppingListQuantity">ilość</h2>
                <h2 className="topInfoShoppingListPrice">cena</h2>
                <div className="topInfoShoppingListSpace">

                </div>
                <div  className="shoppingListDeleteIconButton">
                    <h2> akcja </h2>
                </div>
            </div>
            <div className="shoppingListConainer">
                <ShoppingList data={productDataCart.data} addNewField={addNewField} showNewFields={showNewFields}
                              newFields={newFields} setNewFields={setNewFields} shoppingCartActions = {shoppingCartActions}
                />


            </div>
            <div className="shoppingListSpace">

            </div>
            <div className="deleteAllButtonDiv">
                <button className="handleDeleteAllCartButton" onClick={shoppingCartActions.removeAllFromCart}><h2>Usuń wszystkie</h2></button>
            </div>
        </>


    )


}