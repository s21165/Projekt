import './Main.css';
import logo from './data/logo.svg'
import {Link, Route, Routes} from "react-router-dom";
import {Fridge} from "./mainPages/products/fridge/Fridge";
import {Account} from "./mainPages/account/Account";
import {Notifications} from "./mainPages/notifications/Notifications";
import {Icon} from '@iconify/react';
import React, {useContext, useEffect, useState} from "react";
import EditAccount from "./mainPages/account/EditAccount";
import Products from "./mainPages/products/productList/Products";
import AddProduct from "./mainPages/products/add/AddProduct";
import Login from "./mainPages/account/Login";
import Help from "./mainPages/Help";
import ChatContainer from "./mainPages/chatBot/ChatContainer";
import {AuthContext} from "./mainPages/account/auth-context";
import {ShoppingCart} from "./mainPages/shoppingCart/ShoppingCart";
import {Settings} from "./mainPages/settings/Settings";
import {Advert} from "./mainPages/advert/Advert";
import {GenerateQR} from "./mainPages/products/QR/GenerateQR";
import {handleClickToggleMenu} from "./mainPages/hooks/handleClickToggleMenu";

//główna funkcja na której podmieniają się elementy podstron aplikacji
function Main() {
    //zmienna określająca czy widoczne jest pierwsze czy drugie menu
    const [secoundMenu, setSecoundMenu] = useState(false);
    //zmienna określająca czy menu jest rozwinięte
    const [isOpen, setIsOpen] = useState(true);
    //zmienna określająca czy ikony są widoczne
    const [isIcon, setIsIcon] = useState(true);
    // zmienna przetrzymująca informację na temat szerokości okna
    const [lowResolution, setLowResolution] = useState(window.innerWidth);

    //funkcja wykonujaca wylogowanie
    const { logout } = useContext(AuthContext);

    //zmiana menu na otwarte bądź zamknięte
    const onToggleMenu = () => {
        //wywołanie funkcji posiadającej logikę od zamykania bądź otwierania menu wraz z potrzebnymi wartościami
        handleClickToggleMenu(isOpen, setIsOpen, isIcon, setIsIcon);
    };

    //funkcja wylogowania
    const  handleLogout = () => {
        //wywołuje wylogowanie
        logout();
    };


    useEffect(() => {

        //aktualizuje zmienną lowResolution o aktualną szerokość okna
        const handleResize = () => {
            setLowResolution(window.innerWidth);
        };
        //dodaje nasłuchiwanie na zmianę wielkości okna
        window.addEventListener('resize', handleResize);

        //zwraca usunięcie nasłuchiwania
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, [isOpen, lowResolution]);// odświeża się przy zmianie wartości wskazanych zmiennych


    return (
        <>
            {/* kontener, w którym mieści się aplikacja */}
            <div className="full">
                {/* kontener, w którym mieści się ciało aplikacji, w zależności od wartości isOpen ustawia się
                inna nazwa klasy elementu */}
                <div className={isOpen ? "body" : "body-slimMenu"}>
                    {/* wykaz ścieżek do podstron aplikacji */}
                    <nav className="wholeContainer">
                        {/*kontener posiadający elementy nawigazycjne - drogi do linków oraz elementy odnoszące się
                        do funkcji, które wywołują*/}
                        <Routes>
                            <Route path="/dodajProdukt" element={<AddProduct/>}/>
                            <Route path="/Produkty" element={<Products/>}/>
                            <Route path="/edycjaKonta" element={<EditAccount/>}/>
                            <Route path="/" element={<Fridge/>}/>
                            <Route path="/ListaZakupow" element={<ShoppingCart/>}/>
                            <Route path="/Konto" element={<Account/>}/>
                            <Route path="/Powiadomienia" element={<Notifications/>}/>
                            <Route path="/Sklepy" element={<Fridge/>}/>
                            {/* tutaj przekazujemy do funkcji dodatkowy parametr wskazujący jakie wartości ma
                            posiadać strona - tu wskazujemy na drogę do pełnych ustawień */}
                            <Route path="/Ustawienia" element={<Settings where='settings'/>}/>
                            <Route path="/Pomoc" element={<Help/>}/>
                            <Route path="/Zaloguj" element={<Login/>}/>
                            <Route path="/Chatbot" element={<ChatContainer/>}/>
                            <Route path="/Advert" element={<Advert/>}/>
                            <Route path="/GenerateQR" element={<GenerateQR/>}/>


                        </Routes>
                    </nav>

                    {/* kontener nadający lekki margines z prawej strony posiada kontenery z menu bocznym */}
                    <div className="space">
                        {/* w zależności od wartości isOpen nadaje nazwę klasy odnośnie szerokiemu i wąskiemu menu */}
                        <nav className={isOpen ? "menu" : "slimMenu"}>
                            {/* dla ekranów o szerokości powyżej bądź równiej 1200px pokaż div, który posiada ikonę ze
                             strzałką od rozwijania i zwijania menu */}
                            {lowResolution >= 1200 && <div className="navExpandButton">
                                <button onClick={onToggleMenu}>{isIcon ?
                                    <Icon icon="material-symbols:arrow-forward-ios"/> :
                                    /* w zależności od wartości isIcon zmienia kierunek na który wskazuje strzałka
                                    * (rozwinięte menu wskazuje aby je zwinąć, zwinięte aby rozwinąć) */
                                    <Icon icon="material-symbols:arrow-back-ios-new"/>} </button>
                            </div>}
                            {/* dla ekranów o szerokości powyżej bądź równiej 1200px */}
                            {lowResolution >= 1200 ?
                                /* ustawia logo jako link do strony głównej */
                                <Link to="/">
                                    <div className="logoContainer">
                                        {/* w zależności od wartości isIcon ustawia klasę ikony na duże bądź małe */}
                                        <img src={logo} alt="Your Image" className={isIcon ? "logo" : "smallLogo"}/>
                                    </div>
                                </Link>
                                :
                                /* dla ekranów o szerokości poniżej 1200px ustawia logo jako element do wysuwania bądź
                                * chowania menu */
                                <button onClick={onToggleMenu}>
                                    <div className="logoContainer">
                                        {/* w zależności od wartości isIcon ustawia klasę ikony na duże bądź małe */}
                                        <img src={logo} alt="Your Image" className={isIcon ? "logo" : "smallLogo"}/>
                                    </div>
                                </button>
                            }
                            {/* Jeśli wartość secoundMenu jest prawdą to pokazuje: */}
                            {secoundMenu && (
                                /* kontener z drugim menu, w zależności od wartości secoundMenu ustawia widoczność elementu */
                                <div className={secoundMenu ? "visible" : "invisible"}>

                                    {/* kontener z linkami do podstron */}
                                    <div className="menuNav">

                                        {/* link do powiadomień */}
                                        <Link to="/Powiadomienia">
                                            {/* kontener z nazwą i ikoną linku */}
                                            <div className="navDiv">
                                                {/* jeśli isIcon to pokazuje nazwę, jeśli nie to ikonę */}
                                                {isIcon ? <h3> powiadomienia</h3> :
                                                    <Icon className="menuIcons"
                                                          icon="ic:baseline-notifications"/>}
                                            </div>
                                        </Link>
                                        {/* link do ustawień */}
                                        <Link to="/Ustawienia">
                                            <div className="navDiv">
                                                {isIcon ? <h3>ustawienia</h3> :
                                                    <Icon className="menuIcons"
                                                          icon="fa6-solid:screwdriver-wrench"/>}
                                            </div>
                                        </Link>
                                        {/* link do konta */}
                                        <Link to="/Konto">
                                            <div className="navDiv">
                                                {isIcon ? <h3>konto</h3> :
                                                    <Icon className="menuIcons"
                                                          icon="material-symbols:account-circle-outline"/>}
                                            </div>
                                        </Link>
                                        {/* link do pomocy */}
                                        <Link to="/Chatbot">
                                            <div className="navDiv">
                                                {isIcon ? <h3>chatbot</h3> :
                                                    <Icon className="menuIcons" icon="bx:bot" />}
                                            </div>
                                        </Link>
                                        {/* link do generowania kodów QR */}
                                        <Link to="/GenerateQR">
                                            <div className="navDiv">
                                                {isIcon ? <h3>generuj</h3> :
                                                    <Icon className="menuIcons" icon="vaadin:qrcode" />}
                                            </div>
                                        </Link>
                                        {/* przycisk do zmiany menu */}
                                        <button className="menuNavButton"
                                                onClick={() => {
                                                    {/* po naciśnięciu zmienia stan secoundMenu na przeciwny */}
                                                    setSecoundMenu(!secoundMenu)
                                                }}
                                        >
                                            <div className="navDiv">

                                                {isIcon ? <h3>menu</h3> :
                                                    <Icon className="menuIcons" icon="mdi:menu-up-outline"/>}
                                            </div>
                                        </button>

                                    </div>
                                </div>
                            )}
                            {/* kontener z pierwszym menu, w zależności od wartości secoundMenu ustawia widoczność elementu */}
                            <div className={secoundMenu ? "invisible" : "visible"}>
                                <div className="menuNav">
                                    <div>
                                        {/* link do strony głównej */}
                                        <Link to="/">
                                            <div className="navDiv">
                                                {isIcon ? <h3>lodówka</h3> :
                                                    <Icon className="menuIcons" icon="tabler:fridge"/>}
                                            </div>
                                        </Link>
                                        {/* link do listy zakupów */}
                                        <Link to="/ListaZakupow">
                                            <div className="navDiv">
                                                {isIcon ? <h3>lista zakupów</h3> :

                                                    <Icon className="menuIcons" icon="uiw:shopping-cart" />}
                                            </div>
                                        </Link>
                                        {/* link do strony dodawania produktów */}
                                        <Link to="/dodajProdukt">
                                            <div className="navDiv">
                                                {isIcon ? <h3>dodaj produkt</h3> :
                                                    <Icon className="menuIcons" icon="fluent:add-28-filled"/>}
                                            </div>
                                        </Link>
                                        {/* link do strony produktów */}
                                        <Link to="/Produkty">
                                            <div className="navDiv">
                                                {isIcon ? <h3>produkty</h3> :
                                                    <Icon className="menuIcons"
                                                          icon="streamline:shopping-bag-hand-bag-1-shopping-bag-purse-goods-item-products"/>}
                                            </div>
                                        </Link>
                                        {/* przycisk do zmiany menu */}
                                        <button className="menuNavButton"
                                                onClick={() => {
                                                    setSecoundMenu(!secoundMenu)
                                                }}
                                        >
                                            <div className="navDiv">
                                                {isIcon ? <h3>menu</h3> :
                                                    <Icon className="menuIcons" icon="mdi:menu-down-outline"/>}

                                            </div>
                                        </button>
                                        {/* kontener, który po naciśnięciu wylogowuje użytkownika */}
                                        <div className="navDiv" onClick={handleLogout}>
                                            {isIcon ? <h3>wyloguj</h3> :
                                                <Icon className="menuIcons" icon="grommet-icons:logout"/>}
                                        </div>


                                    </div>

                                </div>
                            </div>

                        </nav>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Main;