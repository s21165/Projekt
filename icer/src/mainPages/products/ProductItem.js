import React, {useEffect, useRef, useState} from 'react';
import './ProductItem.css';

import {GetBorderStyle} from "./GetBorderStyle";

import image2 from '../../data/image6.png';
import {infoProducts,smallProductsCount,mediumProductsCount} from "../../config";
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
                         onProductClick,
                         maxDimension,
                         rightButtonDivRef
                     }) {

    const[image, setImage] = useState();
    const [animatingProductId, setAnimatingProductId] = useState(null);


    const picGetter = PictureGetter(image,setImage,data.zdjecie_lokalizacja)
    const mediumProductsCountSetting =3;
    const smallProductsCountSetting =3;
    const styl = GetBorderStyle(data, filter, 2);
    const [info, setInfo] = useState(0);

    const itemWidth = !isSelected ? maxDimension * (smallProductsCount[smallProductsCountSetting]/ 100) : maxDimension*95/100;
    const itemWidthLarge = maxDimension * (smallProductsCount[2]/ 100);
    const itemWidthMedium = maxDimension * ((mediumProductsCount[mediumProductsCountSetting])/ 100);

    const useProduct = useProductItem(data, handleDecrease, handleIncrease,handleZero,handleRemove, setIsSelected)
    const elementRef = useRef(null);
    function getFontSize(mediumProductsCountSetting, maxDimension) {
        switch (mediumProductsCountSetting) {
            case 0:
                return maxDimension * 1 / 70; // example ratio
            case 1:
                return maxDimension * 1 / 60; // adjust these ratios as needed
            case 2:
                return maxDimension * 1 / 50;
            case 3:
                return maxDimension * 1 / 40;
            case 4:
                return maxDimension * 1 / 30;
            default:
                return 16; // default font size if none of the cases match
        }
    }





    try {
        if (data) {



            switch (size) {
                case 'small':
                    return (

                        <div key={index}

                             className={`productItemSmall ${isSelected ? 'selected' : ''} ${isHidden ? 'hidden' : ''}`}
                             style={{backgroundImage: `url(${data ? picGetter :  image2})`, border: styl,flex: `1 0 ${itemWidth}px`, // Ustawienie szerokości elementu
                                 height: `${itemWidth}px`}}
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
                             className={`productItem ${!info ? '' : 'hidden'} ${animatingProductId === data.id ? 'animating' : ''}`}
                             ref={elementRef}
                             style={{
                                 backgroundImage: `url(${picGetter})`,
                                 border: styl,
                                 flex: `1 0 ${itemWidthMedium}px`,
                                 height: `${itemWidthMedium}px`,
                                 fontSize: getFontSize(mediumProductsCountSetting, maxDimension) // updated line
                             }}
                             onClick={() => setInfo(!info)}>
                            <ProductItemMedium
                                data={data}
                                useProduct={useProduct}
                                handleZero={handleZero}
                                handleRemove={handleRemove}
                                handleEditClick={handleEditClick}
                                info={info}
                                elementRef={elementRef}
                                animatingProductId={animatingProductId}
                                setAnimatingProductId={setAnimatingProductId}
                                filter={filter}
                                itemWidthMedium={itemWidthMedium}
                                mediumProductsCountSetting= {mediumProductsCountSetting}
                                rightButtonDivRef={rightButtonDivRef}
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
