import React, {useEffect, useRef, useState} from "react";
import {GetBorderStyle} from "./products/GetBorderStyle";
import './ShoppingList.css'
import {Icon} from "@iconify/react";
import {ToastContainer} from "react-toastify";

export function ShoppingList({data, showNewFields, newFields, setNewFields}) {
    const [selectedItems, setSelectedItems] = useState([]);
    const lastFieldRef = useRef(null);
    const handleFieldChange = (index, field, value) => {

        const updatedFields = [...newFields];
        updatedFields[index][field] = value;
        setNewFields(updatedFields);
    };

    useEffect(() => {
        if (showNewFields && newFields.length > 0) {
            lastFieldRef.current?.scrollIntoView({behavior: 'smooth'});
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
                <ToastContainer/>
                {data?.map((item) => (
                    <div className={`shoppingList ${selectedItems.includes(item.id) ? 'crossed' : ''}`} key={item.id}

                         onClick={() => toggleSelectedItem(item.id)}>


                        <h2 className="shoppingListName">{item.nazwa}</h2>
                        <h2 className="shoppingListQuantity">{item.ilosc}</h2>
                        <h2 className="shoppingListPrice">{item.cena}zł</h2>
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
                    <div className="shoppingList" key={index}
                         ref={index === newFields.length - 1 ? lastFieldRef : null}>
                        <div className="shoppingListNameInputDiv" >
                            <h4 className="shoppingListNameInputDivName">nazwa</h4>
                            <input className="shoppingListNameInput" type="text" value={field.nazwa}
                                   onChange={(e) => handleFieldChange(index, 'nazwa', e.target.value)}/>

                        </div>
                        <div className="shoppingListQuantityInputDiv">
                            <h4 className="shoppingListNameInputDivQuantity">ilość</h4>
                            <input className="shoppingListQuantityInput" type="number" value={field.ilosc}
                                   onChange={(e) => handleFieldChange(index, 'ilosc', e.target.value)}/>

                        </div>
                        <div className="shoppingListPriceInputDiv">
                            <h4 className="shoppingListNameInputDivPrice">cena</h4>
                            <input className="shoppingListPriceInput" type="number" value={field.cena}
                                    onChange={(e) => handleFieldChange(index, 'cena', e.target.value)}/>

                        </div>
                        <div className="shoppingListSpace"></div>
                        <button className="shoppingListDeleteIconButton">
                            <Icon className="shoppingListDeleteIcon" icon="tabler:check"/>
                        </button>
                    </div>

                ))}


            </div>

        </>
    );
}
