import React, {useState} from 'react';
import './ProductItem.css';
import {Icon} from "@iconify/react";
import {GetBorderStyle} from "./GetBorderStyle";
import products from "./Products";
import image2 from '../../data/image6.png'

function ProductItem({index, data, handleRemove, handleEditClick, handleIncrease, handleDecrease, filter, handleZero}) {
    const [showRemovalConfirmation, setShowRemovalConfirmation] = useState(false);
    const style = GetBorderStyle(data, filter, 1);
    const [info, setInfo] = useState(true);

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

    const encodeImageToBase64 = () => {
        const image = new Image();
        image.src = data.zdjecie;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
        const base64String = canvas.toDataURL('image/png').split(',')[1];
        return base64String;
    }

    const declineRemoval = () => {

        setShowRemovalConfirmation(false);
    }
    return (
        <>

        <div key={index}
             className={`productItem ${!info ? '' : 'hidden'}`}
             style={{
                 backgroundImage: `url(${image2})`
                ,border:style
             }}
             onClick={() => setInfo(!info)}>
            <div>
                <>
                    {showRemovalConfirmation ? (
                        <>
                            <p>Produkt {data.nazwa} zostanie usunięty, kontynuować?</p>
                            <button onClick={confirmRemoval}>DO KOSZA</button>
                            <button onClick={declineRemoval}>ZOSTAW</button>
                        </>
                    ) : (

                        <div className={`card ${!info ? 'hidden' : ''}`} >

                            <div ><h2>{data.nazwa}</h2></div>
                            <div><h3>Cena: {data.cena}</h3></div>
                            <div><h3>Kalorie: {data.kalorie}</h3></div>
                            <div><h3>Tłuszcze: {data.tluszcze}</h3></div>
                            <div><h3>Węglowodany: {data.weglowodany}</h3></div>
                            <div><h3>Białko: {data.bialko}</h3></div>
                            <div><h3>Kategoria: {data.kategoria}</h3></div>
                            <div><h3>trzecia wartosc: {data.trzecia_wartosc}</h3></div>

                            <div className="productItemQuantityDiv">

                                <div className="quantityControl">
                                    <button className="decreaseProduct" onClick={handleDecreaseWithCheck}><h2>-</h2>
                                    </button>

                                    <span><h3>Ilość: {data.ilosc}</h3></span>
                                    <button className="increaseProduct" onClick={() => handleIncrease(data.id)}>
                                        <h2>+</h2>
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
                    )}</>
            </div>

        </div>
        </>
    );
}

export default ProductItem;
