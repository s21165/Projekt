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
                         maxDimension
                     }) {

    const[image, setImage] = useState();

    const picGetter = PictureGetter(image,setImage,data.zdjecie_lokalizacja)

    const styl = GetBorderStyle(data, filter, 2);
    const [info, setInfo] = useState(infoProducts);

    const itemWidth = maxDimension * (smallProductsCount[0]/ 100);
    const itemWidthLarge = maxDimension * (smallProductsCount[2]/ 100);
    const itemWidthMedium = maxDimension * ((mediumProductsCount[1])/ 100);

    const useProduct = useProductItem(data, handleDecrease, handleIncrease, setIsSelected)
    const elementRef = useRef(null);
    const [fontSize, setFontSize] = useState(15);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width } = entry.contentRect;
                // Oblicz nową wielkość czcionki w oparciu o szerokość elementu
                const newFontSize = fontSize * ((mediumProductsCount[1])/ 100) // Przykład obliczenia, dostosuj wg potrzeb
                setFontSize(newFontSize);
                console.log(itemWidthMedium, maxDimension)
            }
        });

        if (elementRef.current) {
            resizeObserver.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                resizeObserver.unobserve(elementRef.current);
            }
            resizeObserver.disconnect();
        };
    }, []);


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
                             className={`productItem ${!info ? '' : 'hidden'}`}
                             ref={elementRef}
                             style={{backgroundImage: `url(${picGetter})`, border: styl,flex: `1 0 ${itemWidthMedium}px`, // Ustawienie szerokości elementu
                                 height: `${itemWidthMedium}px`,fontSize:fontSize}}
                             onClick={() => setInfo(!info)}>
                            <ProductItemMedium
                                data={data}
                                useProduct={useProduct}
                                handleZero={handleZero}
                                handleRemove={handleRemove}
                                handleEditClick={handleEditClick}
                                info={info}
                                filter={filter}
                                itemWidthMedium={itemWidthMedium}

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
