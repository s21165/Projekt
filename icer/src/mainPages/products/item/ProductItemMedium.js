import React, {useEffect} from 'react';
import {Icon} from "@iconify/react";
import {formatDate} from "../../hooks/formatDate";
import {useShoppingCartActions} from "../../shoppingCart/useShoppingCartActions";

function ProductItemMedium({data, useProduct,elementRef,rightButtonDivRef, animatingProductId,setAnimatingProductId, handleZero, handleRemove, handleEditClick, info, filter, mediumProductsCountSetting}) {

    //tworzenie obiektu do akcji wykonywanych na liście zakupów
    const shoppingCartActions = useShoppingCartActions()

    useEffect(() => {
        //jesli jest referencja do elemettu i id animacji produtkut jest zgodny z produktem to:
        if (elementRef && animatingProductId === data.id) {
            //ustal miejsce produktu
            const productRect = elementRef.current.getBoundingClientRect();
            //ustal miejsce przycisku "wyczerpane"
            const buttonRect = rightButtonDivRef.current.getBoundingClientRect();
            //ustal odległość w osi X między przyciskiem a produktem
            const distanceX = buttonRect.left - productRect.left;
            //ustal odległość w osi Y między przyciskiem a produktem
            const distanceY = (buttonRect.bottom - productRect.bottom);
            //przesuń produkt o wybrane odległości przy tym zmniejszając jego wielkość do zera
            elementRef.current.style.transform = `translate(${distanceX}px, ${distanceY}px) scale(0)`;
            //zmniejsz widoczność produktu do 30%
            elementRef.current.style.opacity = '0.3';

            //po zakończeniu animacji
            const handleTransitionEnd = () => {
                //przenieś produkt do listy produktów wyczerpanych
                handleZero(data.id);
                //ustaw id animacji produktu na null
                setAnimatingProductId(null);
                //usuń słuchacza
                elementRef.current.removeEventListener('transitionend', handleTransitionEnd);
                //nadaj widoczność elementu równą 100%
                elementRef.current.style.opacity = '1';
            };
            //dodaj słuchacza
            elementRef.current.addEventListener('transitionend', handleTransitionEnd);
            return () => {
                //usuń słuchacza
                elementRef.current.removeEventListener('transitionend', handleTransitionEnd);
            };
        } else if (elementRef) {
            //w innym wypadku, czyli jak nie ma animowanego id, zmień wartość o 0px. - czyli pozostaw w miejscu
            elementRef.current.style.transform = `translateX(0px)`;

        }
    }, [animatingProductId, data.id, elementRef, rightButtonDivRef]); //odśwież przy zmianie jakiejś z tych wartości

    //przy przenoszeniu do produktów wyczerpanych
    const onRemoveClick = () => {
        //ustaw id animacji an id produktu
        setAnimatingProductId(data.id);
    }


    return (
        <>
            {/* jeśli jest komunikat "czy na pewno przenieść do wyczerpanych" jest pokazany i filtr = 'current' */}
            {useProduct.showRemovalConfirmation && filter==='current' ? (
                //kontener z informacją czy przenieść do produktów wyczerpanych
                <div className="moveToBinConfirmationDiv" >
                    {/*  komunikat  */}
                    <h1 className="moveToBinConfirmationInfoHeader">Produkt {data.nazwa} zostanie przeniesiony do listy zużytych produktów wyczerpanych,
                        kontynuować?</h1>
                    {/*  kontener z przyciskami */}
                    <div className="moveToBinConfirmationButtons">
                        {/*  przycisk z funkcją przeniesienia do listy wyczerpanych  */}
                        <button onClick={onRemoveClick} className="moveToBinConfirmationButton"><h2>WYCZERPANY</h2></button>
                        {/*  przycisk z odrzuceniem zmian  */}
                        <button onClick={useProduct.declineRemoval} className="moveToBinDeclineButton"><h2>ZOSTAW</h2></button>
                    </div>
                </div>
            ) : (// w zależności od wartości zmiennej info nadaj klasę, która pokazuje informację bądź je ukrywa
                <div className={`card ${!info ? 'hidden' : ''}`}>
                    {/* kontener, po wciśnięciu dodaje produkt do listy zakupów */}
                    <div className="productItemToListIconDiv" onClick={()=>{shoppingCartActions.addToCartFromProducts(data.produktID)}}><Icon className="productItemToListIcon" icon="fluent-mdl2:add-to-shopping-list" /></div>
                    <div className="productCardInfoRow"><h2>{data.nazwa}</h2></div>
                    <div className="productCardInfoRow"><h3>Cena: {data.cena}</h3></div>
                    <div className="productCardInfoRow"><h3>Kalorie: {data.kalorie}</h3></div>
                    <div className="productCardInfoRow"><h3>Tłuszcze: {data.tluszcze}</h3></div>
                    <div className="productCardInfoRow"><h3>Węglowodany: {data.weglowodany}</h3></div>
                    <div className="productCardInfoRow"><h3>Białko: {data.bialko}</h3></div>
                    <div className="productCardInfoRow"><h3>Kategoria: {data.kategoria}</h3></div>
                    <div className="productCardInfoRow"><h3>data ważności: {formatDate(data.data_waznosci)}</h3></div>


                    {/*  kontener z przyciskami kontroli ilości produktu  */}
                    <div className="productItemQuantityDiv"
                         >
                        {/*  wewnętrzny kontener z przuyciskami kontroli ilości produktu  */}
                        <div className="quantityControl">
                            {/*  przucisk zmniejszający ilość  */}
                            <button className="decreaseProduct" style={{ padding: mediumProductsCountSetting === 0 ? 0 : 'calc(0.2vw + 0.2vh) calc(0.4vw + 0.4vh)' }} onClick={useProduct.handleDecreaseWithCheck}>
                                <h2><Icon className="iconifyIcon" icon="tdesign:minus"/></h2>
                            </button>

                            <span><h3 className="productCardInfoRow">Ilość: {data.ilosc}</h3></span>
                            {/*  przucisk zwiększający ilość  */}
                            <button className="increaseProduct" style={{ padding: mediumProductsCountSetting === 0 ? 0 : 'calc(0.2vw + 0.2vh) calc(0.4vw + 0.4vh)' }} onClick={useProduct.handleIncreaseItem}>
                                <h2><Icon className="iconifyIcon" icon="pepicons-pencil:plus"/></h2>
                            </button>

                        </div>
                    </div>
                    {/*  kontener z przyciskami edycji produktu, przeniesienia do produktów wyczerpanych bądź usunięcia produktu  */}
                    <div className="iconContainer"

                    >   {/*  jeśli filt ma wartość 'current' to  */}
                        {filter === 'current' ?
                            /*  pokaż przycisk przeniesienia do listy wyczerpanych  */
                            <button className="removeButton" style={{ padding: mediumProductsCountSetting === 0 ? 0 : 'calc(0.2vw + 0.2vh) calc(0.4vw + 0.4vh)' }} onClick={onRemoveClick}>
                                <h2><Icon className="iconifyIcon" icon="ph:trash-bold"/></h2></button>
                            :
                            /*  w innym wypadku pokaż przycisk usunięcia produktu  */
                            <button className="removeButton" style={{ padding: mediumProductsCountSetting === 0 ? 0 : 'calc(0.2vw + 0.2vh) calc(0.4vw + 0.4vh)' }} onClick={() => handleRemove(data.id)}>
                                <h2><Icon className="iconifyIcon" icon="ic:baseline-delete-forever"/></h2>
                            </button>}

                        {/* przycisk z edycją produktu */}
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
