import React, {useState} from 'react';
import './ProductItem.css';
import {Icon} from "@iconify/react";
import {GetBorderStyle} from "./GetBorderStyle";
import products from "./Products";
import image2 from '../../data/image6.png'
import {infoProducts} from "../../config";
import {useProductItem} from "./useProductItem";
import ProductItemSmall from "./ProductItemSmall";
import ProductItemMedium from "./ProductItemMedium";
import ProductItemLarge from "./ProductItemLarge";
import {useOutsideClick} from "./useOutsideClick";

function ProductItem({index, data, handleRemove, handleEditClick, handleIncrease, handleDecrease, filter, handleZero, size, isSelected,setIsSelected, // Dodano nowy prop isSelected
                         isHidden,onProductClick })
                          {

    const styl = GetBorderStyle(data, filter, 2);
    const [info, setInfo] = useState(infoProducts);

    const useProduct = useProductItem(data, handleDecrease, handleIncrease,setIsSelected)


    try {
        if (data) {


            switch (size) {
                case 'small':
                    return (

                        <div key={index}
                             className={`productItemSmall ${isSelected ? 'selected' : ''} ${isHidden ? 'hidden' : ''}`}
                             style={{backgroundImage: `url(${image2})`, border: styl}}
                             onClick={() => onProductClick(data.id)}>


                            {isSelected   ?
                                <ProductItemLarge
                                    data={data}
                                    useProduct={useProduct}
                                    handleZero={handleZero}
                                    handleRemove={handleRemove}
                                    handleEditClick={handleEditClick}
                                    filter={filter}
                                    info={info}
                                    setIsSelected={setIsSelected}
                                />
                                :
                                <ProductItemSmall
                                    data={data}
                                    useProduct={useProduct}
                                    handleZero={handleZero}
                                    handleRemove={handleRemove}
                                    handleEditClick={handleEditClick}
                                    filter={filter}
                                />
                            }
                                </div>

                    );

                case 'medium':
                    return (
                        <div key={index}
                             className={`productItem ${!info ? '' : 'hidden'}`}
                             style={{backgroundImage: `url(${image2})`, border: styl}}
                             onClick={() => setInfo(!info)}>
                            <ProductItemMedium
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
                default:

            }


        }


    } catch (error) {
    console.error("Error in productItem:", error);
}
}

export default ProductItem;
