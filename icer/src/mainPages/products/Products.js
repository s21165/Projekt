import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Products.css';
import ProductEdit from "./ProductEdit";
import ProductItem from "./ProductItem";

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
            data_waznosci: new Date(product[9]).toISOString().split('T')[0]
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
    const handleIncrease = (productId) => {
        // Znajdź produkt o danym ID i zwiększ jego ilość
        const updatedProducts = data.map(product => {
            if (product[0] === productId) {
                product[8]++; // Zwiększenie ilości o 1
            }
            return product;
        });
        setData(updatedProducts);
    }

    const handleDecrease = (productId) => {
        // Znajdź produkt o danym ID i zmniejsz jego ilość
        const updatedProducts = data.map(product => {
            if (product[0] === productId && product[8] > 0) {
                product[8]--; // Zmniejszenie ilości o 1
            }
            return product;
        });
        setData(updatedProducts);
    }


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
                    <ProductEdit
                        product={editingProduct}
                        handleEdit={handleEdit}
                        setEditingProduct={setEditingProduct}
                    />
                )}{data && !editingProduct &&data.map((data, index) =>
                    <ProductItem
                        key={index}
                        data={data}
                        handleRemove={handleRemove}
                        handleEditClick={handleEditClick}
                        handleIncrease={handleIncrease}
                        handleDecrease={handleDecrease}
                    />
                )}
            </div>
            <div>

            </div>
        </>
    );
};
export default Products;