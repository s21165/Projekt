import React, {useEffect, useRef, useState} from 'react';
import ProductEdit from "../edit/ProductEdit";
import ProductItem from "../item/ProductItem";
import {Settings} from "../../settings/Settings";
import {Icon} from "@iconify/react";

//funkcja odpowiedzialna za ustawianie odpowiednich wartości na produktach, przyjmuje wartości od komponentu rodzica
function ProductManager({
                            editingProduct,
                            productActions,
                            productData,
                            filter,
                            setEditingProduct,
                            setFilter,
                            size

                        }) {
    //wartość określająca id wybranego produktu
    const [selectedProductId, setSelectedProductId] = useState(null);
    //referencja do listy produktów
    const productListRef = useRef(null);

    //inicjowanie zmiennej, która posiada mniejszą z wartości szerokości a wysokości listy produktów
    const [minDimension, setMinDimension] = useState(0);

    //inicjowanie zmiennej, która posiada wymiar okna listy produktów
    const [dimension,setDimension]=useState({width:0, height:0});

    //referencja do prawego przycisku listy zakupów, listy produktów wyczerpanych
    const rightButtonDivRef = useRef(null);

    //inicjowanie wartości określającej czy ustawienia są rozwinięte czy nie
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    //referencja do kontenera ustawień
    const sidebarRef = useRef(null);

    //zmiana wartości określającej czy ustawienia są widoczne
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    useEffect(() => {
        //ustawienie obserwatora na referencję
        const observeTarget = productListRef.current;
        //jeśli istnieje to:
        if (observeTarget) {
            // tworzenie obserwatora śledzącego zmiany w wielkości
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const { width, height } = entry.contentRect;
                    // przypisanie stanu na mniejszą wartość z width i height
                    setMinDimension(Math.min(width, height));
                    //przypisanie wymiarów
                    setDimension({width:width,height:height})

                }
            });
            //wskazanie co ma obserwować
            resizeObserver.observe(observeTarget);

            // Czyszczenie przy odmontowywaniu
            return () => resizeObserver.unobserve(observeTarget);
        }
    }, [dimension,minDimension,editingProduct, productData]);//odśwież kiedy któryś z tych elementów ulegnie zmianie

    //jeśli element zostanie naciśnięty nadaj wartość do selectedProductId jako jego id
    const handleProductClick = (productId) => {
        setSelectedProductId(selectedProductId === productId ? null : productId);
    };

    return (
        <>
            {/* kontener z ustawieniami */}
            <div
                ref={sidebarRef}//w zależności od wartości isSidebarOpen nadaje odpowiednią klasę
                className={`settings-container-otherSites ${isSidebarOpen ? 'open' : ''}`}

            >   {/* zmień wartość po naciśnięciu*/}
                <button onClick={toggleSidebar} className={`settings-button`}>
                    {/* ikona rozwijania menu */}
                    <Icon className="settingBurgerButton" icon="iconamoon:menu-burger-vertical-duotone" />
                </button>
                {/*jeśli isSidebarOpen jest prawdą to wyświetl funkcję Settings z określoną wartościami określającymi
                 czy ma pokazać ustawienia dla strony produktów czy dla strony lodówki*/}
                {isSidebarOpen && <Settings where={size === 'small' ? 'fridge' : size === 'medium' ? 'products' : ''}/>}
            </div>
            {/* jeśli produkt jest edytowany to pokaż funkcję ProductEdit z przekazanymi wartościami*/}
            {editingProduct ? (

                <ProductEdit
                    product={editingProduct}
                    handleEdit={productActions.handleEdit}
                    setEditingProduct={setEditingProduct}
                />
            ) : (
                <>

                    {/* jeśli jesteśmy na stronie produktów to pokaż przyciski górne*/}
                    {size === 'medium' &&
                        <>
                            <div>{/* kontener z przyciskami */}
                                <div className="listButtons">
                                    {/* kontener z lewym przyciskiem */}
                                    <div className="leftButtonDiv">
                                        {/* przycisk, który w zależności od filtra zmienia swoją klasę, po naciśnięciu
                                        ustala filter na 'current' */}
                                        <button
                                            className={`leftButton ${filter === 'current' ? 'active' : ''}`}
                                            onClick={() => setFilter('current')}>
                                            <h2 className="productListTopButtonsH2">aktualne</h2>
                                        </button>
                                    </div>

                                    {/* kontener z prawym przyciskiem */}
                                    <div className="rightButtonDiv" ref={rightButtonDivRef}>
                                        {/* przycisk, który w zależności od filtra zmienia swoją klasę, po naciśnięciu
                                        ustala filter na 'old' */}
                                        <button
                                            className={`rightButton ${filter === 'old' ? 'active' : ''}`}
                                            onClick={() => setFilter('old')}>
                                            <h2 className="productListTopButtonsH2">wyczerpane</h2>
                                        </button>
                                    </div>

                                </div>
                            </div>
                            {/* element tworzący przestrzeń pomiędzy przyciskami a listą produktów */}
                            <div className="spaceBetweenButtonsAndProductList"></div>


                        </>

                    }

                    {/* jeśli nie jesteśmy na stronie produktów to pokaż tylko listę, w zależności od miejsca różni się jej wysokość */}
                    <div className="productList" ref={productListRef} style={size === 'small' ? {height: "100vh"} : {height: "90vh"}}>
                        {productData.filteredProducts && productData.filteredProducts.map((data, index) =>

                        /* przypisz do funkcji każdy element z danych pobranych o produktach wraz z wartościami */
                            <ProductItem
                                key={index} //jego index
                                data={data} //dane
                                handleRemove={productActions.handleRemove} //usuwanie produktu
                                dimension={dimension} //wymiar
                                minDimension={minDimension} //mniejsza wartość z wymiaru
                                handleEditClick={productActions.handleEditClick} //edycja produktu
                                handleIncrease={productActions.handleIncrease} //dodanie ilości produktu
                                handleDecrease={productActions.handleDecrease} //odjęcie ilości produktu
                                handleZero={productActions.handleZero} //zerowanie ilości produktu
                                filter={filter} //filtr
                                size={size} //wielkość - gdzie wyświetlamy
                                rightButtonDivRef={rightButtonDivRef} //referencja do prawego przycisku ("wyczerpane")
                                isSelected={selectedProductId === data.id} //czy element jest naciśnięty
                                isHidden={selectedProductId !== null && selectedProductId !== data.id} // czy element ma mieć ukryte informacje
                                setIsSelected={setSelectedProductId} // ustawianie elementu naciśniętego
                                onProductClick={() => handleProductClick(data.id)} //ustawianie konkretnego produktu jako zaznaczonego

                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default ProductManager;
