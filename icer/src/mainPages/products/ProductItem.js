import React, {useEffect, useState} from 'react';
import './ProductItem.css';

import {GetBorderStyle} from "./GetBorderStyle";

import image2 from '../../data/image6.png';
import {infoProducts} from "../../config";
import {useProductItem} from "./useProductItem";
import ProductItemSmall from "./ProductItemSmall";
import ProductItemMedium from "./ProductItemMedium";
import ProductItemLarge from "./ProductItemLarge";
import {PictureGetter} from "./PictureGetter";

function ProductItem({
                         index,
                         data,
                         handleRemove,
                         handleEditClick,
                         handleIncrease,
                         handleDecrease,
                         filter,
                         handleZero,
                         size,
                         isSelected,
                         setIsSelected,
                         isHidden,
                         onProductClick
                     }) {

    const[image, setImage] = useState();

    const picGetter = PictureGetter(image,setImage,data.zdjecie_lokalizacja)

    const styl = GetBorderStyle(data, filter, 2);
    const [info, setInfo] = useState(infoProducts);




    const useProduct = useProductItem(data, handleDecrease, handleIncrease, setIsSelected)


    try {
        if (data) {



            switch (size) {
                case 'small':
                    return (

                        <div key={index}
                             className={`productItemSmall ${isSelected ? 'selected' : ''} ${isHidden ? 'hidden' : ''}`}
                             style={{backgroundImage: `url(${data ? picGetter :  image2})`, border: styl}}
                             onClick={() => onProductClick(data.id)}>


                                {isSelected ?
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
                             style={{backgroundImage: `url(${picGetter})`, border: styl}}
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
