import './Main.css';
import logo from './data/logo.svg'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link, useLocation, Await
} from "react-router-dom";
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

function Main() {

    const [secoundMenu, setSecoundMenu] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [isIcon, setIsIcon] = useState(true);
    const [lowResolution, setLowResolution] = useState(window.innerWidth);
    const { logout } = useContext(AuthContext);

    const onToggleMenu = () => {
        handleClickToggleMenu(isOpen, setIsOpen, isIcon, setIsIcon);
    };
    const  handleLogout = () => {
        logout();
    };
    useEffect(() => {
        const handleResize = () => {
            setLowResolution(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, [isOpen, lowResolution]);


    return (
        <>
            <div className="full">
                <div className={isOpen ? "body" : "body-slimMenu"}>

                    <nav className="wholeContainer">

                        <Routes>
                            <Route path="/dodajProdukt" element={<AddProduct/>}/>
                            <Route path="/Produkty" element={<Products/>}/>
                            <Route path="/edycjaKonta" element={<EditAccount/>}/>
                            <Route path="/" element={<Fridge/>}/>
                            <Route path="/ListaZakupow" element={<ShoppingCart/>}/>
                            <Route path="/Konto" element={<Account/>}/>
                            <Route path="/Powiadomienia" element={<Notifications/>}/>
                            <Route path="/Sklepy" element={<Fridge/>}/>
                            <Route path="/Ustawienia" element={<Settings where='settings'/>}/>
                            <Route path="/Pomoc" element={<Help/>}/>
                            <Route path="/Zaloguj" element={<Login/>}/>
                            <Route path="/Chatbot" element={<ChatContainer/>}/>
                            <Route path="/Advert" element={<Advert/>}/>
                            <Route path="/GenerateQR" element={<GenerateQR/>}/>


                        </Routes>
                    </nav>


                    <div className="space">

                        <nav className={isOpen ? "menu" : "slimMenu"}>
                            {lowResolution >= 1200 && <div className="navExpandButton">
                                <button onClick={onToggleMenu}>{isIcon ?
                                    <Icon icon="material-symbols:arrow-forward-ios"/> :
                                    <Icon icon="material-symbols:arrow-back-ios-new"/>} </button>
                            </div>}
                            {lowResolution >= 1200 ?
                                <Link to="/">
                                    <div className="logoContainer">
                                        <img src={logo} alt="Your Image" className={isIcon ? "logo" : "smallLogo"}/>
                                    </div>
                                </Link>
                                :
                                <button onClick={onToggleMenu}>
                                    <div className="logoContainer">
                                        <img src={logo} alt="Your Image" className={isIcon ? "logo" : "smallLogo"}/>
                                    </div>
                                </button>
                            }

                            {secoundMenu && (
                                <div className={secoundMenu ? "visible" : "invisible"}>

                                    <div className="menuNav">

                                        <Link to="/Powiadomienia">
                                            <div className="navDiv">
                                                {isIcon ? <h3> powiadomienia</h3> :
                                                    <Icon className="menuIcons"
                                                          icon="ic:baseline-notifications"/>}
                                            </div>
                                        </Link>

                                        <Link to="/Ustawienia">
                                            <div className="navDivMain">
                                                {isIcon ? <h3>ustawienia</h3> :
                                                    <Icon className="menuIcons"
                                                          icon="fa6-solid:screwdriver-wrench"/>}
                                            </div>
                                        </Link>

                                        <Link to="/Konto">
                                            <div className="navDiv">
                                                {isIcon ? <h3>konto</h3> : <Icon className="menuIcons"
                                                                                 icon="material-symbols:account-circle-outline"/>}
                                            </div>
                                        </Link>

                                        <Link to="/Pomoc">
                                            <div className="navDivMain">
                                                {isIcon ? <h3>pomoc</h3> :
                                                    <Icon className="menuIcons" icon="solar:help-linear"/>}
                                            </div>
                                        </Link>
                                        <Link to="/GenerateQR">
                                            <div className="navDivMain">
                                                {isIcon ? <h3>generuj</h3> :
                                                    <Icon className="menuIcons" icon="solar:help-linear"/>}
                                            </div>
                                        </Link>

                                        <button className="menuNavButton"
                                                onClick={() => {
                                                    setSecoundMenu(!secoundMenu)
                                                }}
                                        >
                                            <div className="navDivMain">

                                                {isIcon ? <h3>menu</h3> :
                                                    <Icon className="menuIcons" icon="mdi:menu-up-outline"/>}
                                            </div>
                                        </button>

                                    </div>
                                </div>
                            )}
                            <div className={secoundMenu ? "invisible" : "visible"}>
                                <div className="menuNav">
                                    <div>
                                        <Link to="/">
                                            <div className="navDiv">
                                                {isIcon ? <h3>lodówka</h3> :
                                                    <Icon className="menuIcons" icon="tabler:fridge"/>}
                                            </div>
                                        </Link>
                                        <Link to="/ListaZakupow">
                                            <div className="navDiv">
                                                {isIcon ? <h3>lista zakupów</h3> :
                                                    <Icon className="menuIcons"
                                                          icon="material-symbols:history-rounded"/>}
                                            </div>
                                        </Link>
                                        <Link to="/dodajProdukt">
                                            <div className="navDivMain">
                                                {isIcon ? <h3>dodaj produkt</h3> :
                                                    <Icon className="menuIcons" icon="fluent:add-28-filled"/>}
                                            </div>
                                        </Link>
                                        <Link to="/Produkty">
                                            <div className="navDivMain">
                                                {isIcon ? <h3>produkty</h3> :
                                                    <Icon className="menuIcons"
                                                          icon="streamline:shopping-bag-hand-bag-1-shopping-bag-purse-goods-item-products"/>}
                                            </div>
                                        </Link>

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
                                        <div className="navDivMain" onClick={handleLogout}>
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