import React, {useState} from "react";
import {GetBorderStyle} from "./products/GetBorderStyle";
import './ShoppingList.css'
import {Icon} from "@iconify/react";

export function ShoppingList({data}) {
    const [selectedItems, setSelectedItems] = useState([]);

    const toggleSelectedItem = (itemId) => {
        setSelectedItems(prevItems => {
            if (prevItems.includes(itemId)) {
                // Usuń produkt, jeśli już jest zaznaczony
                return prevItems.filter(id => id !== itemId);
            } else {
                // Dodaj produkt, jeśli nie jest zaznaczony
                return [...prevItems, itemId];
            }
        });
    };
    return (
        <>
            <div>
                {data?.map((item) => (
                    <div className="shoppingList" key={item.id} style={{ backgroundColor: selectedItems.includes(item.id) ? "green" : "#dddd" } } onClick={()=>toggleSelectedItem(item.id)}>


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
