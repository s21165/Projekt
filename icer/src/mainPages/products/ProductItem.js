import React, { useState } from 'react';
import './ProductItem.css';
import {Icon} from "@iconify/react";

function ProductItem({ index, data, handleRemove, handleEditClick, handleIncrease, handleDecrease }) {
    const [showRemovalConfirmation, setShowRemovalConfirmation] = useState(false);

    const handleDecreaseWithCheck = () => {
        if (data.ilosc === 1) {
            setShowRemovalConfirmation(true);
        } else {
            handleDecrease(data.id);
        }
    }

    const confirmRemoval = () => {
        handleDecrease(data.id);
        setShowRemovalConfirmation(false);
    }

    const declineRemoval = () => {

        setShowRemovalConfirmation(false);
    }

    return (
        <div key={index} className="productItem">
            {showRemovalConfirmation ? (
                <>
                    <p>Produkt {data.nazwa} zostanie usunięty, kontynuować?</p>
                    <button onClick={confirmRemoval}>DO KOSZA</button>
                    <button onClick={declineRemoval}>ZOSTAW</button>
                </>
            ) : (
                <>
                    <div><h2>{data.nazwa}</h2></div>
                    <div><h3>Cena: {data.cena}</h3></div>
                    <div><h3>Kalorie: {data.kalorie}</h3></div>
                    <div><h3>Tłuszcze: {data.tluszcze}</h3></div>
                    <div><h3>Węglowodany: {data.weglowodany}</h3></div>
                    <div><h3>Białko: {data.bialko}</h3></div>
                    <div><h3>Kategoria: {data.kategoria}</h3></div>
                    <div className="productItemQuantityDiv">

                        <div className="quantityControl">
                            <button className="decreaseProduct" onClick={handleDecreaseWithCheck}><h2>-</h2></button>

                            <span><h3>Ilość:    {data.ilosc}</h3></span>
                            <button className="increaseProduct" onClick={() => handleIncrease(data.id)}><h2>+</h2></button>
                        </div>
                    </div>
                    <div><h3>Data: {new Date(data.data_waznosci).toISOString().split('T')[0]}</h3></div>
                    <div className="iconContainer">
                        <button className="removeButton" onClick={() => handleRemove(data.id)} data-id={data.id}>
                            <h2><Icon className="iconifyIcon" icon="ph:trash-bold" /></h2>
                        </button>
                        <button className="editButton" onClick={() => handleEditClick(data)} data-id={data.id}>
                            <h2><Icon className="iconifyIcon" icon="uil:edit" /></h2>
                        </button>
                    </div>

                </>
            )}
        </div>
    );
}

export default ProductItem;
