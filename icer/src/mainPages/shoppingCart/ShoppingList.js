import React, {useEffect, useRef, useState} from "react";
import {GetBorderStyle} from "../products/item/GetBorderStyle";
import './ShoppingList.css'
import {Icon} from "@iconify/react";


//funcja listy zakupów przyjmująca wartości opisane w funkcji, która ją wywołuje
export function ShoppingList({data, showNewFields, newFields, setNewFields, shoppingCartActions}) {

    //zmienna określająca czy element został wybrany
    const [selectedItems, setSelectedItems] = useState([]);

    //referencja do dołu listy zakupów
    const lastFieldRef = useRef(null);

    //hook aktualizujący wartości w polach wejściowych
    const handleFieldChange = (index, field, value) => {

        const updatedFields = [...newFields];
        updatedFields[index][field] = value;
        setNewFields(updatedFields);
    };

    useEffect(() => {
        //jeśli showNewFields jest prawdą oraz długość tablicy newFields jest większa od zera to widok ma zostać "scrollowany"
        //do miejsca gdzie wykorzystana została referencja czyli do ostatniego elementu listy zakupów.
        if (showNewFields && newFields.length > 0) {
            lastFieldRef.current?.scrollIntoView({behavior: 'smooth'});
        }
    }, [newFields, showNewFields,shoppingCartActions]);

    //dodanie funkcjonalności "skreślenia" produktu z listy zakupów
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
                {/*jeśli są dane to mapuj je*/}
                {data?.map((item) => (
                    /*kontener z elementem listy, po naciśnięciu go będzie przekreślony*/
                    <div className={`shoppingList ${selectedItems.includes(item.id) ? 'crossed' : ''}`} key={item.id}
                         onClick={() => toggleSelectedItem(item.id)}
                         >

                        {/*wartości elementu listy*/}
                        <h2 className="shoppingListName" >{item.nazwa}</h2>
                        <h2 className="shoppingListQuantity">{item.ilosc}</h2>
                        <h2 className="shoppingListPrice">{item.cena}zł</h2>

                        {/*przerwa pomiędzy elementami a przyciskiem*/}
                        <div className="shoppingListSpace"></div>

                        {/*przycisk do usuwania elementu listy*/}
                        <button onClick={()=>{shoppingCartActions.removeFromCart(item.produktID)}} className="shoppingListDeleteIconButton">
                            <Icon className="shoppingListDeleteIcon"
                                  icon="octicon:x-24"
                            />
                        </button>

                    </div>

                ))}
                {/* tworzenie widoku elementu do ręcznego dodania */}
                {newFields.map((field, index) => (
                    <div className="shoppingList" key={index}
                          /* referencja wskazuje na ostatni index, jeśli taki jest, jeśli nie to ustawia null*/
                         ref={index === newFields.length - 1 ? lastFieldRef : null}>
                        {/* kontener na nazwę wraz z informacją i miejscem na dane od użytkownika */}
                        <div className="shoppingListNameInputDiv" >
                            <h4 className="shoppingListNameInputDivName">nazwa</h4>
                            <input className="shoppingListNameInput" type="text" value={field.nazwa}
                                   onChange={(e) => handleFieldChange(index, 'nazwa', e.target.value)}/>

                        </div>
                        {/* kontener na ilość  wraz z informacją i miejscem na dane od użytkownika */}
                        <div className="shoppingListQuantityInputDiv">
                            <h4 className="shoppingListNameInputDivQuantity">ilość</h4>
                            <input className="shoppingListQuantityInput" type="number" value={field.ilosc}
                                   onChange={(e) => handleFieldChange(index, 'ilosc', e.target.value)}/>

                        </div>
                        {/* kontener na cenę  wraz z informacją i miejscem na dane od użytkownika */}
                        <div className="shoppingListPriceInputDiv">
                            <h4 className="shoppingListNameInputDivPrice">cena</h4>
                            <input className="shoppingListPriceInput" type="number" value={field.cena}
                                    onChange={(e) => handleFieldChange(index, 'cena', e.target.value)}/>

                        </div>
                        {/* przerwa między kontenerami */}
                        <div className="shoppingListSpace"></div>
                        {/* przycisk dodwania poszególnego elementu listy zakupów wraz z ikoną */}
                        <button className="shoppingListDeleteIconButton" onClick={()=>{shoppingCartActions.addToCart(field)}}>
                            <Icon className="shoppingListDeleteIcon" icon="tabler:check"/>
                        </button>
                    </div>

                ))}


            </div>

        </>
    );
}
