import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {ShoppingList} from "./ShoppingList";
import "./ShoppingList.css"
import {API_URL} from "../settings/config";
import {useProductCartData} from "./useProductCartData";
import {Icon} from "@iconify/react";
import {useShoppingCartActions} from "./useShoppingCartActions";

//Funcja przedstawiająca stronę listy zakupów
export function ShoppingCart() {

    //inicjuję obiekt, który posiada aktualne dane listy zakupów
    const productDataCart = useProductCartData();

    //zmnienna określajaca widoczność pola dodawania ręcznego do listy zakupów
    const [showNewFields, setShowNewFields] = useState(false);

    //zmienna posiadająca dane wpisane jako nowa pozycja w liście zakupów
    const [newFields, setNewFields] = useState([]);

    //inicjuję obiekt, który posiada możliwe do wykonania akcje na liście zakupów
    const shoppingCartActions = useShoppingCartActions();

    //hook do uzupełniania pól po zdecydowaniu się na dodanie pozycji ręcznie, po ponownym naciśnięciu przycisku, który
    //wywołuje tego hooka pole się pojawia bądź znika
    const addNewField = () => {
        if (showNewFields) {
            setNewFields([]); // Usuń pole, jeśli już istnieje
        } else {
            setNewFields([{nazwa: '', ilosc: 0, cena: 0}]); // Dodaj nowe pole
        }
        setShowNewFields(!showNewFields); //zmień stan na pokaż bądź ukryj wiersz do wprowadzenia danych
    };


    return (

        <>  {/* kontener z przyciskiem ręcznego dodawania do listy zakupów */}
            <div className="handleAddToCartButtonDiv">
                {/*przycisk dodawania, w zależności od wartości zmiennej showNewFields zmienia się napis na przycisku*/}
                <button className="handleAddAllCartButton" onClick={addNewField}>{showNewFields ?
                    <h2>cofnij dodawanie</h2> : <h2>dodaj</h2>}</button>

            </div>
            {/*Kontener z nagłówkami*/}
            <div className="topInfoShoppingCart">
                {/*nagłówki z informacjami co mieści się pod nimi*/}
                <h2 className="topInfoShoppingListName">nazwa</h2>
                <h2 className="topInfoShoppingListQuantity">ilość</h2>
                <h2 className="topInfoShoppingListPrice">cena</h2>
                <div className="topInfoShoppingListSpace">

                </div>
                <div  className="shoppingListDeleteIconButton">
                    <h2> dodaj/usuń </h2>
                </div>
            </div>
            {/*kontener z listą zakupów*/}
            <div className="shoppingListConainer">
                {/*wywołanie funkcji z listą zakupów, która przyjmuje poniższe wartości*/}
                <ShoppingList data={productDataCart.data} addNewField={addNewField} showNewFields={showNewFields}
                              newFields={newFields} setNewFields={setNewFields} shoppingCartActions = {shoppingCartActions}
                />


            </div>
            {/*kontener służący za przerwę między kontenerami*/}
            <div className="shoppingListSpace">

            </div>
            {/*przycisk z funkcją usuwania wszystkich wartości w liście zakupów*/}
            <div className="deleteAllButtonDiv">
                <button className="handleDeleteAllCartButton" onClick={shoppingCartActions.removeAllFromCart}><h2>Usuń wszystkie</h2></button>
            </div>
        </>


    )


}