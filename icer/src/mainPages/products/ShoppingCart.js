import {useEffect} from "react";
import axios from "axios";
import {ShoppingList} from "../ShoppingList";
import {useProductsDataNoFilter} from "./useProductsData";


export function ShoppingCart(){

    const productDataNoFilter = useProductsDataNoFilter();

    return(
        <>
            <ShoppingList data = {productDataNoFilter.data}/>

       </>



    )


}