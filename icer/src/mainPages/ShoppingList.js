import React, {useState} from "react";
import {GetBorderStyle} from "./products/GetBorderStyle";
import './ShoppingList.css'
import {Icon} from "@iconify/react";

export function ShoppingList({data}) {
    return (
        <>
            <div>
                {data?.map((item, index) => (
                    <div className="shoppingList" key={index}>


                        <h2 className="shoppingListName">{item.nazwa}</h2>
                        <h3 className="shoppingListQuantity">ilość: {item.ilosc}</h3>
                        <h3 className="shoppingListPrice">cena: {item.cena}zł</h3>
                        <div className="shoppingListSpace">

                        </div>
                        <button className="shoppingListDeleteIconButton">
                            <Icon className="shoppingListDeleteIcon"
                                  icon="octicon:x-24"
                            />
                        </button>

                    </div>
                ))}
            </div>

        </>
    );
}
