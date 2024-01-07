import React, {useEffect} from "react";
import axios from "axios";
import {ShoppingList} from "./ShoppingList";
import {useProductsDataNoFilter} from "./products/useProductsData";
import "./ShoppingList.css"

export function ShoppingCart(){

    const productDataNoFilter = useProductsDataNoFilter();

    return(
        <div  className="shoppingListConainer">
            <ShoppingList data = {productDataNoFilter.data}/>
            <div className="deleteAllButtons">

                <button className="handleDeleteAllButton"><h2>Usuń wszystkie</h2></button>
            </div>
       </div>



    )


}