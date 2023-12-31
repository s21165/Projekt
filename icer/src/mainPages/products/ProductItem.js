import React, {useState} from 'react';
import './ProductItem.css';
import {Icon} from "@iconify/react";
import {GetBorderStyle} from "./GetBorderStyle";
import products from "./Products";
import image2 from '../../data/image6.png'
import {infoProducts} from "../../config";
import {useProductItem} from "./useProductItem";
import ProductItemSmall from "./ProductItemSmall";

function ProductItem({index, data, handleRemove, handleEditClick, handleIncrease, handleDecrease, filter, handleZero,size}) {

    const styl = GetBorderStyle(data, filter, 2);
    const [info, setInfo] = useState(infoProducts);
    const useProduct = useProductItem(data, handleDecrease, handleIncrease)

    try {
        if (data) {


            switch (size) {
                case 'small':

                    break;
                case 'medium':
                    return (
                        <div key={index}
                             className={`productItem ${!info ? '' : 'hidden'}`}
                             style={{backgroundImage: `url(${image2})`, border: styl}}
                             onClick={() => setInfo(!info)}>
                            <ProductItemSmall
                                data={data}
                                useProduct={useProduct}
                                handleZero={handleZero}
                                handleRemove={handleRemove}
                                handleEditClick={handleEditClick}
                                info={info}
                                filter={filter}
                            />
                        </div>
                    );

                case 'big':

                    break;
                case 4:

                    break;
                default:

            }


        }


    } catch (error) {
    console.error("Error in productItem:", error);
}
}

export default ProductItem;
