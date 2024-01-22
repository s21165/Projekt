import React, {useEffect, useRef, useState} from 'react';
import {Icon} from "@iconify/react";
import {formatDate} from "../account/hooks/formatDate";
import {useShoppingCartActions} from "./useShoppingCartActions";

function ProductItemMedium({data, useProduct,elementRef,rightButtonDivRef, animatingProductId,setAnimatingProductId, handleZero, handleRemove, handleEditClick, info, filter, mediumProductsCountSetting}) {
    const shoppingCartActions = useShoppingCartActions()

    useEffect(() => {
        if (elementRef && animatingProductId === data.id) {
            const productRect = elementRef.current.getBoundingClientRect();
            const buttonRect = rightButtonDivRef.current.getBoundingClientRect();
            console.log('productRect ' + productRect.left + 'buttonRect ' + buttonRect.left)
            const distanceX = buttonRect.left - productRect.left;
            const distanceY = (buttonRect.bottom - productRect.bottom);
            console.log('productRect: ' + productRect.right + 'buttonRect: ' + buttonRect.right + 'productRectTop: ' + productRect.bottom + 'buttonRectTop: ' + buttonRect.top)
            console.log('distanceX: ' + distanceX + 'distanceY: ' + distanceY)
            elementRef.current.style.transform = `translate(${distanceX}px, ${distanceY}px) scale(0)`;
            elementRef.current.style.opacity = '0.3';
            const handleTransitionEnd = () => {
                handleZero(data.id);
                setAnimatingProductId(null); // Reset animatingProductId after animation
                elementRef.current.removeEventListener('transitionend', handleTransitionEnd);
                elementRef.current.style.opacity = '1';
            };
            elementRef.current.addEventListener('transitionend', handleTransitionEnd);
            return () => {
                elementRef.current.removeEventListener('transitionend', handleTransitionEnd);
            };
        } else if (elementRef) {
            elementRef.current.style.transform = `translateX(0px)`;

        }
    }, [animatingProductId, data.id, elementRef, rightButtonDivRef]);

    const onRemoveClick = () => {
        setAnimatingProductId(data.id);
    }


    return (
        <>

            {useProduct.showRemovalConfirmation && filter==='current' ? (
                <div className="moveToBinConfirmationDiv" >
                    <h1 className="moveToBinConfirmationInfoHeader">Produkt {data.nazwa} zostanie przeniesiony do listy zużytych produktów wyczerpanych,
                        kontynuować?</h1>
                    <div className="moveToBinConfirmationButtons">
                        <button onClick={onRemoveClick} className="moveToBinConfirmationButton"><h2>WYCZERPANY</h2></button>
                        <button onClick={useProduct.declineRemoval} className="moveToBinDeclineButton"><h2>ZOSTAW</h2></button>
                    </div>
                </div>
            ) : (
                <div className={`card ${!info ? 'hidden' : ''}`}>
                    <div className="productItemToListIconDiv" onClick={()=>{shoppingCartActions.addToCartFromProducts(data.id)}}><Icon className="productItemToListIcon" icon="fluent-mdl2:add-to-shopping-list" /></div>
                    <div className="productCardInfoRow"><h2>{data.nazwa}</h2></div>
                    <div className="productCardInfoRow"><h3>Cena: {data.cena}</h3></div>
                    <div className="productCardInfoRow"><h3>Kalorie: {data.kalorie}</h3></div>
                    <div className="productCardInfoRow"><h3>Tłuszcze: {data.tluszcze}</h3></div>
                    <div className="productCardInfoRow"><h3>Węglowodany: {data.weglowodany}</h3></div>
                    <div className="productCardInfoRow"><h3>Białko: {data.bialko}</h3></div>
                    <div className="productCardInfoRow"><h3>Kategoria: {data.kategoria}</h3></div>
                    <div className="productCardInfoRow"><h3>data ważności: {formatDate(data.data_waznosci)}</h3></div>



                    <div className="productItemQuantityDiv"
                         >

                        <div className="quantityControl">
                            <button className="decreaseProduct" style={{ padding: mediumProductsCountSetting === 0 ? 0 : 'calc(0.2vw + 0.2vh) calc(0.4vw + 0.4vh)' }} onClick={useProduct.handleDecreaseWithCheck}>
                                <h2><Icon className="iconifyIcon" icon="tdesign:minus"/></h2>
                            </button>

                            <span><h3 className="productCardInfoRow">Ilość: {data.ilosc}</h3></span>
                            <button className="increaseProduct" style={{ padding: mediumProductsCountSetting === 0 ? 0 : 'calc(0.2vw + 0.2vh) calc(0.4vw + 0.4vh)' }} onClick={useProduct.handleIncreaseItem}>
                                <h2><Icon className="iconifyIcon" icon="pepicons-pencil:plus"/></h2>
                            </button>

                        </div>
                    </div>

                    <div className="iconContainer"

                    >
                        {filter === 'current' ?
                            <button className="removeButton" style={{ padding: mediumProductsCountSetting === 0 ? 0 : 'calc(0.2vw + 0.2vh) calc(0.4vw + 0.4vh)' }} onClick={onRemoveClick}>
                                <h2><Icon className="iconifyIcon" icon="ph:trash-bold"/></h2></button>
                            :

                            <button className="removeButton" style={{ padding: mediumProductsCountSetting === 0 ? 0 : 'calc(0.2vw + 0.2vh) calc(0.4vw + 0.4vh)' }} onClick={() => handleRemove(data.id)}>
                                <h2><Icon className="iconifyIcon" icon="ic:baseline-delete-forever"/></h2>
                            </button>}


                        <button className="editButton" style={{ padding: mediumProductsCountSetting === 0 ? 0 : 'calc(0.2vw + 0.2vh) calc(0.4vw + 0.4vh)' }} onClick={() => handleEditClick(data)}>
                            <h2><Icon className="iconifyIcon" icon="uil:edit"/></h2>
                        </button>
                    </div>

                </div>
            )}
        </>
    );
}

export default ProductItemMedium;
