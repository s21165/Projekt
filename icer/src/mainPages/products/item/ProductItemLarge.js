import React, {useRef} from 'react';
import {Icon} from "@iconify/react";
import {useOutsideClick} from "../hooks/useOutsideClick";
import {formatDate} from "../../hooks/formatDate";
import {useShoppingCartActions} from "../../shoppingCart/useShoppingCartActions";

//funkcja przedstawiająca duży produkt, czyli wybrany z listy produktów na głównej stronie - lodówce
function ProductItemLarge({ data, useProduct,handleZero, handleRemove, handleEditClick, filter,setIsSelected}) {

    //referencja
    const myDivRef = useRef();

    //przy naciśnięciu poza produkt zmienia stan isSelected na null - nie ma żadnego wybranego produktu
    useOutsideClick(myDivRef, () => setIsSelected(null));

    //pobiera akcje z listy zakupów
    const shoppingCartActions = useShoppingCartActions()
    return (
        //kontener posiadający cały duży produkt
        <div ref={myDivRef} className="LargeProductItemContainer">
            {/* jeśli jest komunikat "czy na pewno przenieść do wyczerpanych" jest pokazany to:*/}
            {useProduct.showRemovalConfirmation ? (
                //kontener z informacją czy przenieść do produktów wyczerpanych
                <div className="moveToBinConfirmationDiv">
                    {/*  komunikat  */}
                    <h1 className="moveToBinConfirmationInfoHeader">Produkt {data.nazwa} zostanie przeniesiony do
                        listy zużytych produktów wyczerpanych,
                        kontynuować?</h1>
                    {/*  kontener z przyciskami */}
                    <div className="moveToBinConfirmationButtons">
                        {/*  przycisk z funkcją przeniesienia do listy wyczerpanych  */}
                        <button onClick={useProduct.confirmRemoval} className="moveToBinConfirmationButton"><h2>WYCZERPANY</h2></button>
                        {/*  przycisk z odrzuceniem zmian  */}
                        <button onClick={useProduct.declineRemoval} className="moveToBinDeclineButton"><h2>ZOSTAW</h2></button>
                    </div>
                </div>
            ) : (// kontener z informacjami o produkcie
                <div className="card" >
                    {/* kontener, po wciśnięciu dodaje produkt do listy zakupów */}
                    <div className="productItemLargeToListIconDiv" onClick={()=>{shoppingCartActions.addToCartFromProducts(data.produktID)}}><Icon className="productItemToListIcon" icon="fluent-mdl2:add-to-shopping-list" /></div>
                    <div className="productCardInfoRow"><h2>{data.nazwa}</h2></div>
                    <div className="productCardInfoRow"><h3>Cena: {data.cena}</h3></div>
                    <div className="productCardInfoRow"><h3>Kalorie: {data.kalorie}</h3></div>
                    <div className="productCardInfoRow"><h3>Tłuszcze: {data.tluszcze}</h3></div>
                    <div className="productCardInfoRow"><h3>Węglowodany: {data.weglowodany}</h3></div>
                    <div className="productCardInfoRow"><h3>Białko: {data.bialko}</h3></div>
                    <div className="productCardInfoRow"><h3>Kategoria: {data.kategoria}</h3></div>
                    <div className="productCardInfoRow"><h3>data ważności: {formatDate(data.data_waznosci)}</h3></div>

                    {/*  kontener z przyciskami kontroli ilości produktu  */}
                    <div className="productItemQuantityDiv">
                        {/*  wewnętrzny kontener z przuyciskami kontroli ilości produktu  */}
                        <div className="quantityControlLarge">
                            {/*  przucisk zmniejszający ilość  */}
                            <button className="decreaseProduct" onClick={useProduct.handleDecreaseWithCheck}>
                                <h2><Icon className="iconifyIcon" icon="tdesign:minus" /></h2>
                            </button>

                            <span><h3>Ilość: {data.ilosc}</h3></span>
                            {/*  przucisk zwiększający ilość  */}
                            <button className="increaseProduct" onClick={useProduct.handleIncreaseItem }>
                                <h2><Icon className="iconifyIcon" icon="pepicons-pencil:plus" /></h2>
                            </button>

                        </div>
                    </div>
                    {/*  kontener z przyciskami edycji produktu, przeniesienia do produktów wyczerpanych*/}
                    <div className="iconContainer">
                        {/*  pokaż przycisk przeniesienia do listy wyczerpanych  */}
                            <button className="removeButton" onClick={() => handleZero(data.id)}>
                                <h2><Icon className="iconifyIcon" icon="ph:trash-bold"/></h2></button>
                        {/* przycisk z edycją produktu */}
                        <button className="editButton" onClick={() => handleEditClick(data)}>
                            <h2><Icon className="iconifyIcon" icon="uil:edit"/></h2>
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}

export default ProductItemLarge;
