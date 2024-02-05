import React, {useContext, useEffect, useRef, useState} from 'react';
import './ProductItem.css';

import {GetBorderStyle} from "./GetBorderStyle";
import {mediumProductsCount, smallProductsCount} from "../../settings/config";
import {useProductItem} from "../hooks/useProductItem";
import ProductItemSmall from "./ProductItemSmall";
import ProductItemMedium from "./ProductItemMedium";
import ProductItemLarge from "./ProductItemLarge";
import {PictureGetter} from "../pictures/PictureGetter";
import SettingsContext from "../../settings/SettingsContext";
import {getFontSize} from "../hooks/getFontSize";

//funkcja odpowiedzialna za wyświetlanie produktu, przyjmuje wartości od rodzica
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
                         minDimension,
                         rightButtonDivRef
                     }) {

    //ustawianie obrazka
    const [image, setImage] = useState();
    //inicjowanie wartości czy produkt jest animowany
    const [animatingProductId, setAnimatingProductId] = useState(null);

    //pobieranie wartości ustawień z kontekstu
    const {
        getFridgeSizeIndex,
        getProductsSizeIndex, infoProducts
    } = useContext(SettingsContext)

    // ustawianie zdjęcia względem pobranych informacji
    const picGetter = PictureGetter(image, setImage, data?.zdjecie_lokalizacja)
    //przupisanie ustawienia dla strony produktów
    const mediumProductsCountSetting = getProductsSizeIndex();
    //przupisanie ustawienia dla strony lodówki
    const smallProductsCountSetting = getFridgeSizeIndex();
    //ustawianie wartości do obramówki, przekazujemy filter i dane, ustawiamy szerokość obramówki
    const styl = GetBorderStyle(data, filter, 3);
    //przupisanie ustawienia dla strony produktów
    const infoProductsNumeric = infoProducts ? 1 : 0;
    //w zależności od ustawień pokaż bądź ukryj informacje o produktach
    const [info, setInfo] = useState(infoProductsNumeric);
    //ustalanie wysokości i szerokości elementu listy w lodówce
    const itemWidth = !isSelected ? minDimension * (smallProductsCount[smallProductsCountSetting] / 100) : minDimension * 95 / 100;
    //ustalanie wysokości i szerokości elementu listy na stronie produktów
    const itemWidthMedium = minDimension * ((mediumProductsCount[mediumProductsCountSetting]) / 100);
    //tworzenie obiektu, który posiada możliwe akcje na produkcie opisane w funkcji
    const useProduct = useProductItem(data, handleDecrease, handleIncrease, handleZero, handleRemove, setIsSelected)
    // referencja do elementu do animacji przy przenoszeniu do listy wyczerpanych
    const elementRef = useRef(null);


    useEffect(() => {
        //ustawianie wartości przy odświeżaniu aby zmiany pojawiały się od razu
        setInfo(infoProducts ? 1 : 0);
    }, [getFridgeSizeIndex,
        getProductsSizeIndex, infoProducts])//odświeżanie przy zmianie wartości elementów


    try {//jeśli są dane to
        if (data) {


            //w zależności od wartości size:
            switch (size) {
                case 'small':
                    return (
                        //wyświetla na stronie głównej - lodówce
                        <div key={index}
                            //ustawianie klasy względem tego czy produkt jest zaznaczony i czy jest ukryty
                             className={`productItemSmall ${isSelected ? 'selected' : ''} ${isHidden ? 'hidden' : ''}`}
                            //ustawianie zdjęcia jako tło produtku
                             style={{
                                 backgroundImage: `url(${picGetter})`, border: styl, flex: `1 0 ${itemWidth}px`, // Ustawienie szerokości elementu
                                 height: `${itemWidth}px`
                             }}
                             onClick={() => onProductClick(data.id)}>

                            {/*jeśli jest zaznaczony to wyświetl funkcję ProductItemLarge z przekazanymi wartościami */}
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
                                /*w przeciwnym wypadku wyświetl funkcję ProductItemSmall */
                                <ProductItemSmall/>
                            }

                        </div>

                    );
                // na stronie produktów
                case 'medium':
                    return (

                        <div key={index}
                            //ustawianie klasy względem tego czy produkt ma posiadać informacje i czy jest animowany
                             className={`productItem ${!info ? '' : 'hidden'} ${animatingProductId === data.id ? 'animating' : ''}`}
                             ref={elementRef}
                             style={{
                                 //obrazek produktu na tle
                                 backgroundImage: `url(${picGetter})`,
                                 //ustawienie obramówki
                                 border: styl,
                                 flex: `1 0 ${itemWidthMedium}px`,
                                 height: `${itemWidthMedium}px`,
                                 // ustawienie wielkości czcionki
                                 fontSize: getFontSize(mediumProductsCountSetting, minDimension)
                             }}
                            //przy naciśnięciu zmień wartość info na przeciwną
                             onClick={() => setInfo(!info)}>
                            {/* wyświetl funkcję ProductItemMedium z przekazanymi wartościami */}
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
                                mediumProductsCountSetting={mediumProductsCountSetting}
                                rightButtonDivRef={rightButtonDivRef}
                            />
                        </div>
                    );

                default:
            }

        }


    } catch (error) {
        //w razie błędów wyświetl error z serwera w konsoli
        console.error("Error in productItem:", error);
    }
}

export default ProductItem;
