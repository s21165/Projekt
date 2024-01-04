import React, {useRef} from 'react';
import { Icon } from "@iconify/react";
import {useOutsideClick} from "./useOutsideClick";

function ProductItemLarge({ data, useProduct,handleZero, handleRemove, handleEditClick, info, filter,setIsSelected}) {
    const myDivRef = useRef();
    useOutsideClick(myDivRef, () => setIsSelected(null));


    return (
        <div ref={myDivRef} className="LargeProductItemContainer">
            {useProduct.showRemovalConfirmation ? (
                <div className="moveToBinConfirmationDiv">
                    <h1 className="moveToBinConfirmationInfoHeader">Produkt {data.nazwa} zostanie przeniesiony do kosza,
                        kontynuować?</h1>
                    <div className="moveToBinConfirmationButtons">
                        <button onClick={useProduct.confirmRemoval} className="moveToBinConfirmationButton"><h2>DO KOSZA</h2></button>
                        <button onClick={useProduct.declineRemoval} className="moveToBinDeclineButton"><h2>ZOSTAW</h2></button>
                    </div>
                </div>
            ) : (
                <div className={`card`} >

                    <div ><h2>{data.nazwa}</h2></div>
                    <div><h3>Cena: {data.cena}</h3></div>
                    <div><h3>Kalorie: {data.kalorie}</h3></div>
                    <div><h3>Tłuszcze: {data.tluszcze}</h3></div>
                    <div><h3>Węglowodany: {data.weglowodany}</h3></div>
                    <div><h3>Białko: {data.bialko}</h3></div>
                    <div><h3>Kategoria: {data.kategoria}</h3></div>
                    <div><h3>trzecia wartosc: {data.trzecia_wartosc}</h3></div>

                    <div className="productItemQuantityDiv">

                        <div className="quantityControlLarge">
                            <button className="decreaseProduct" onClick={useProduct.handleDecreaseWithCheck}>
                                <h2><Icon className="iconifyIcon" icon="tdesign:minus" /></h2>
                            </button>

                            <span><h3>Ilość: {data.ilosc}</h3></span>
                            <button className="increaseProduct" onClick={useProduct.handleIncreaseItem }>
                                <h2><Icon className="iconifyIcon" icon="pepicons-pencil:plus" /></h2>
                            </button>

                        </div>
                    </div>

                    <div className="iconContainer">
                        {filter === 'current' ?
                            <button className="removeButton" onClick={() => handleZero(data.id)}>
                                <h2><Icon className="iconifyIcon" icon="ph:trash-bold"/></h2></button>
                            :

                            <button className="removeButton" onClick={() => handleRemove(data.id)}>
                                <h2><Icon className="iconifyIcon" icon="ic:baseline-delete-forever"/></h2>
                            </button>}


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
