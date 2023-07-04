import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Products.css';
function Products() {
    const [data, setData] = useState(null);
    let [jsonData, setJsonData] = useState(null);
    const [refresh, setRefresh] = useState(false); // Dodajemy stan do odświeżania ekranu


    useEffect(() => {
        axios.get('http://localhost:5000/api/products')  // zmień URL na rzeczywisty adres endpointa
            .then((response) => {
                setData(response.data);
                console.log("sama data:" + data);
            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    }, []);
    useEffect(() => {
        if (data) {
            setJsonData = JSON.stringify(data);  // Przekształcenie obiektu JavaScript na dane w formacie JSON
            console.log("jsondata: " + jsonData);
        }
    }, [refresh]);
    const handleRemove = (id) => {
        const config = {
            headers: {
                'Content-Type': 'application/json', // Ustawienie nagłówka Content-Type na application/json
            },
        };
        axios
            .put(`http://localhost:5000/api/products/${id}`, {}, config)
            .then((response) => {
                console.log(response.data);
                // Możesz wykonać odpowiednie akcje po usunięciu produktu
                setRefresh(!refresh); // Zmieniamy stan "refresh", aby odświeżyć ekran
            })
            .catch((error) => {
                console.error(`There was an error removing the product: ${error}`);
            });
    };

    return (
        <div className="productList">
            {data && data.map((data, index) =>
                <div key={index} className="productItem">
                    <h2>id: {data[0]}</h2>
                    <p>Nazwa: {data[1]}</p>
                    <p>Cena: {data[2]}</p>
                    <p>Kalorie: {data[3]}</p>
                    <p>Tłuszcze: {data[4]}</p>
                    <p>Węglowodany: {data[5]}</p>
                    <p>Białko: {data[6]}</p>
                    <p>Kategoria: {data[7]}</p>
                    <p>Ilość: {data[8]}</p>
                    <button onClick={() => handleRemove(data[0])} data-id={data[0]}>
                        Usuń
                    </button>
                </div>
            )}
        </div>
    );
};
export default Products;