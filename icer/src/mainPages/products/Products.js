import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Products.css';
import ProductEdit from "./ProductEdit";
import ProductItem from "./ProductItem";
import { useContext } from 'react';
import { AuthContext } from '../account/auth-context';
import {json} from "react-router-dom";

function Products() {

    const { user } = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;
    const [data, setData] = useState(null);


    const [refresh, setRefresh] = useState(false); // Dodajemy stan do odświeżania ekranu
    const [editingProduct, setEditingProduct] = useState(null);


    useEffect(() => {

        setEditingProduct(null);
        console.log(sessionId)

        axios.post('http://localhost:5000/api/Icer',  { sessionId: sessionId })
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setData(response.data);
                } else {
                    console.warn("The response data is not an array!");
                }
                console.log("sama data:" + JSON.stringify(response.data[0]));

            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    }, [refresh]);

    return (
        <>
            <div className="listButtons">
                <div className="leftButtonDiv">
                    <button className="leftButton" >Aktualne</button>
                </div>
                <div className="rightButtonDiv">
                    <button className="rightButton" >Stare</button>
                </div>
            </div>
            <div className="siema">
                {data && data.map((data, index) =>
    <>
                    <p key={index}>(data[1]): {data.ilosc}</p>
                    <p> key={index}>(data[1]): {data.nazwa}</p>
    </>)
                }
                {/*{editingProduct && (*/}
                {/*    <ProductEdit*/}
                {/*        product={editingProduct}*/}
                {/*        // handleEdit={handleEdit}*/}
                {/*        setEditingProduct={setEditingProduct}*/}
                {/*    />*/}
                {/*)}*/}
            {/*    {data && !editingProduct && data.map((data, index) =>*/}

            {/*    // <ProductItem*/}
            {/*    //     key={index}*/}
            {/*    //     data={data}*/}
            {/*    //     // handleRemove={handleRemove}*/}
            {/*    //     // handleEditClick={handleEditClick}*/}
            {/*    //     // handleIncrease={handleIncrease}*/}
            {/*    //     // handleDecrease={handleDecrease}*/}
            {/*    // />*/}
            {/*)}*/}
            </div>
            <div>

            </div>
        </>
    );
}
export default Products;