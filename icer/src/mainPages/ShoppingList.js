import React, {useEffect, useRef, useState} from "react";
import {GetBorderStyle} from "./products/GetBorderStyle";
import './ShoppingList.css'
import {Icon} from "@iconify/react";
import {ToastContainer} from "react-toastify";

export function ShoppingList({data, addNewField, showNewFields, newFields, setNewFields}) {
    const [selectedItems, setSelectedItems] = useState([]);
    const lastFieldRef = useRef(null);
    const handleFieldChange = (index, field, value) => {

        const updatedFields = [...newFields];
        updatedFields[index][field] = value;
        setNewFields(updatedFields);
    };

    useEffect(() => {
        if (showNewFields && newFields.length > 0) {
            lastFieldRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [newFields, showNewFields]);


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
                <ToastContainer />
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

                     {newFields.map((field, index) => (
                        <div className="shoppingList" key={index} ref={index === newFields.length - 1 ? lastFieldRef : null}>
                            <input className="shoppingListName" type="text" value={field.nazwa} onChange={(e) => handleFieldChange(index, 'nazwa', e.target.value)} />
                            <input className="shoppingListQuantity" type="number" value={field.ilosc} onChange={(e) => handleFieldChange(index, 'ilosc', e.target.value)} />
                            <input className="shoppingListPrice" type="number" value={field.cena} onChange={(e) => handleFieldChange(index, 'cena', e.target.value)} />
                            <div className="shoppingListSpace"></div>

                        </div>

                    ))}




            </div>

        </>
    );
}
