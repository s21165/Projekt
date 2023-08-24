import React from 'react';
import './Products.css';

function ProductItem({ index, data, handleRemove, handleEditClick,handleIncrease,handleDecrease }) {




    return (
<>
            <div key={index} className="productItem">
                {data[8] === 0 ? ( <>
                    <p>Produkt {data[1]} zostanie usunięty, kontynuować?</p>
                    <button onClick={() => handleRemove(data[0])}>usuń</button>

                    <button onClick={() => handleIncrease(data[0])}>zostaw</button>
                </>):<>
                <p><h2>Nazwa: {data[1]}</h2></p>
                <p><h3>Cena: {data[2]}</h3></p>
                <p><h3>Kalorie: {data[3]}</h3></p>
                <p><h3>Tłuszcze: {data[4]}</h3></p>
                <p><h3>Węglowodany: {data[5]}</h3></p>
                <p><h3>Białko: {data[6]}</h3></p>
                <p><h3>Kategoria: {data[7]}</h3></p>
                <p><h3>Ilość:
                    <button onClick={() => handleDecrease(data[0])}>-</button>
                    {data[8]}
                    <button onClick={() => handleIncrease(data[0])}>+</button>
                </h3></p>
                <p><h3>Data: {new Date(data[9]).toISOString().split('T')[0]}</h3></p>

                <button onClick={() => handleRemove(data[0])} data-id={data[0]}>
                    <h2>USUŃ</h2>
                </button>
                <button onClick={() => handleEditClick(data)} data-id={data[0]}>
                    <h2>EDYTUJ</h2>
                </button>
                </>
                }


        </div>

</>
    );
}

export default ProductItem;
