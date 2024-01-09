import React, {useEffect} from "react";
import axios from "axios";
import {ShoppingList} from "./ShoppingList";
import {useProductsDataNoFilter} from "./products/useProductsData";
import "./ShoppingList.css"

export function ShoppingCart() {

    const productDataNoFilter = useProductsDataNoFilter();

    return (

        <>
            <div className="handleAddToCartButtonDiv">

                <button className="handleAddAllCartButton"><h2>dodaj</h2></button>

            </div>
            <div className="shoppingListConainer">
                <ShoppingList data={productDataNoFilter.data}/>


            </div>
            <div className="shoppingListSpace">

            </div>
            <div className="deleteAllButtonDiv">
            <button className="handleDeleteAllCartButton"><h2>Usuń wszystkie</h2></button>
            </div>
            </>


    )


}