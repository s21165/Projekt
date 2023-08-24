import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Products.css';

function Products() {
    const [data, setData] = useState(null);
    // let [jsonData, setJsonData] = useState(null);
    const [refresh, setRefresh] = useState(false); // Dodajemy stan do odświeżania ekranu
    const [editingProduct, setEditingProduct] = useState({
        nazwa: '',
        cena: '',
        kalorie: '',
        tluszcze: '',
        weglowodany: '',
        bialko: '',
        kategoria: '',
        ilosc: '',
        data_waznosci:'',
    });
    const handleEditClick = (product) => {
        setEditingProduct({
            id: product[0],
            nazwa: product[1],
            cena: product[2],
            kalorie: product[3],
            tluszcze: product[4],
            weglowodany: product[5],
            bialko: product[6],
            kategoria: product[7],
            ilosc: product[8],
            data_waznosci: product[9]
        });
    };
    const handleEdit =() => {
        const id = editingProduct.id;
        const config = {
            headers: {
                'Content-Type': 'application/json', // informuje serwer, że dane wysyłane w żądaniu są w formacie JSON.
            },
        };

        axios
            .put(`http://localhost:5000/api/edit_product/${id}`, editingProduct, config)
            .then((response) => {
                console.log(response.data);
                setEditingProduct(null);
                setRefresh(!refresh);
            })
            .catch((error) => {
                console.error(`There was an error updating the product: ${error}`);
            });
    };

    useEffect(() => {
        setEditingProduct(null);
        axios.get('http://localhost:5000/api/products')  // zmień URL na rzeczywisty adres endpointa
            .then((response) => {
                setData(response.data);
                // console.log("sama data:" + data);

            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    }, [refresh]);
    // useEffect(() => {
    //     if (data) {
    //         setJsonData = JSON.stringify(data);  // Przekształcenie obiektu JavaScript na dane w formacie JSON
    //         console.log("jsondata: " + jsonData);
    //     }
    // }, [refresh]);
    const handleRemove = (id) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        axios
            .delete(`http://localhost:5000/api/products/${id}`, config)
            .then((response) => {
                console.log(response.data);
                setRefresh(!refresh); // Refresh the product list after deletion
            })
            .catch((error) => {
                console.error(`There was an error removing the product: ${error}`);
            });
    };

    return (
        <>
            <div className="productList">
                {editingProduct && (
                    <div className="productItem">

                        <p>
                            Nazwa:
                            <input
                                type="text"
                                value={editingProduct.nazwa}
                                onChange={e => setEditingProduct(prev => ({ ...prev, nazwa: e.target.value }))}
                            />
                        </p>
                        <p>
                            Cena:
                            <input
                                type="text"
                                value={editingProduct.cena}
                                onChange={e => setEditingProduct(prev => ({ ...prev, cena: e.target.value }))}
                            />
                        </p>
                        <p>
                            Kalorie:
                            <input
                                type="text"
                                value={editingProduct.kalorie}
                                onChange={e => setEditingProduct(prev => ({ ...prev, kalorie: e.target.value }))}
                            />
                        </p>
                        <p>
                            Tłuszcze:
                            <input
                                type="text"
                                value={editingProduct.tluszcze}
                                onChange={e => setEditingProduct(prev => ({ ...prev, tluszcze: e.target.value }))}
                            />
                        </p>
                        <p>
                            Węglowodany:
                            <input
                                type="text"
                                value={editingProduct.weglowodany}
                                onChange={e => setEditingProduct(prev => ({ ...prev, weglowodany: e.target.value }))}
                            />
                        </p>
                        <p>
                            Białko:
                            <input
                                type="text"
                                value={editingProduct.bialko}
                                onChange={e => setEditingProduct(prev => ({ ...prev, bialko: e.target.value }))}
                            />
                        </p>
                        <p>
                            Kategoria:
                            <input
                                type="text"
                                value={editingProduct.kategoria}
                                onChange={e => setEditingProduct(prev => ({ ...prev, kategoria: e.target.value }))}
                            />
                        </p>
                        <p>
                            Ilość:
                            <input
                                type="text"
                                value={editingProduct.ilosc}
                                onChange={e => setEditingProduct(prev => ({ ...prev, ilosc: e.target.value }))}
                            />
                        </p>
                        <p>
                            Data ważności:
                            <input
                                type="text"
                                value={editingProduct.data_waznosci}
                                onChange={e => setEditingProduct(prev => ({ ...prev, data_waznosci: e.target.value }))}
                            />
                        </p>

                        <button onClick={() => handleEdit()}>Zaktualizuj</button>
                        <button onClick={() => setEditingProduct(null)}>Anuluj</button>

                    </div>
                )}{data && !editingProduct &&data.map((data, index) =>
                    <div key={index} className="productItem">
                        <p><h2>Nazwa: {data[1]}</h2></p>
                        <p><h3>Cena: {data[2]}</h3></p>
                        <p><h3>Kalorie: {data[3]}</h3></p>
                        <p><h3>Tłuszcze: {data[4]}</h3></p>
                        <p><h3>Węglowodany: {data[5]}</h3></p>
                        <p><h3>Białko: {data[6]}</h3></p>
                        <p><h3>Kategoria: {data[7]}</h3></p>
                        <p><h3>Ilość: {data[8]}</h3></p>
                        <button onClick={() => handleRemove(data[0])} data-id={data[0]}>
                            <h2>USUŃ</h2>
                        </button>
                        <button onClick={() => handleEditClick(data)} data-id={data[0]}>
                            <h2>EDYTUJ</h2>
                        </button>
                    </div>
                )}
            </div>
            <div>

            </div>
        </>
    );
};
export default Products;