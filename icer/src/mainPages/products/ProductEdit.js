import React from 'react';
import './Products.css';

function ProductEdit({ product, handleEdit, setEditingProduct }) {
    return (
        <div className="productItem">

            <p>
                Nazwa:
                <input
                    type="text"
                    value={product.nazwa}
                    onChange={e => setEditingProduct(prev => ({ ...prev, nazwa: e.target.value }))}
                />
            </p>
            <p>
                Cena:
                <input
                    type="number"
                    value={product.cena}
                    onChange={e => setEditingProduct(prev => ({ ...prev, cena: e.target.value }))}
                />
            </p>
            <p>
                Kalorie:
                <input
                    type="number"
                    value={product.kalorie}
                    onChange={e => setEditingProduct(prev => ({ ...prev, kalorie: e.target.value }))}
                />
            </p>
            <p>
                Tłuszcze:
                <input
                    type="number"
                    value={product.tluszcze}
                    onChange={e => setEditingProduct(prev => ({ ...prev, tluszcze: e.target.value }))}
                />
            </p>
            <p>
                Węglowodany:
                <input
                    type="number"
                    value={product.weglowodany}
                    onChange={e => setEditingProduct(prev => ({ ...prev, weglowodany: e.target.value }))}
                />
            </p>
            <p>
                Białko:
                <input
                    type="number"
                    value={product.bialko}
                    onChange={e => setEditingProduct(prev => ({ ...prev, bialko: e.target.value }))}
                />
            </p>
            <p>
                Kategoria:
                <input
                    type="text"
                    value={product.kategoria}
                    onChange={e => setEditingProduct(prev => ({ ...prev, kategoria: e.target.value }))}
                />
            </p>
            <p>
                Ilość:
                <input
                    type="number"
                    value={product.ilosc}
                    onChange={e => setEditingProduct(prev => ({ ...prev, ilosc: e.target.value }))}
                />
            </p>
            <p>
                Data ważności:
                <input
                    type="date"
                    value={product.data_waznosci}
                    onChange={e => setEditingProduct(prev => ({ ...prev, data_waznosci: e.target.value }))}
                />
            </p>

            <button onClick={() => handleEdit()}>Zaktualizuj</button>
            <button onClick={() => setEditingProduct(null)}>Anuluj</button>

        </div>
    );
}

export default ProductEdit;
