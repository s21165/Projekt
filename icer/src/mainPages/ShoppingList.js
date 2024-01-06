import {useState} from "react";
import {GetBorderStyle} from "./products/GetBorderStyle";
import './Notifications.css'
import {Icon} from "@iconify/react";

export function ShoppingList({ data}) {


    return (

    <>
    {data && data.map(product => (
        <div className="shoppingList">
            <div>
                {/*<h1>{product.nazwa}</h1>*/}
                {/*<h2>{product.ilosc}</h2>*/}
                {/*<h2>{product.cena}</h2>*/}

            </div>


        </div>
    ))}
    </>
    );
}