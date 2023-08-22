import './Main.css';
import logo from './data/logo.svg'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link, useLocation, Await
} from "react-router-dom";
import {Fridge} from "./mainPages/Fridge";
import {History} from "./mainPages/History";
import {Shops} from "./mainPages/Shops";
import {Account} from "./mainPages/Account";
import {Notifications} from "./mainPages/Notifications";
import {Icon} from '@iconify/react';
import React, {useEffect, useState} from "react";

import Logout from "./mainPages/Logout";
import EditAccount from "./mainPages/EditAccount";
import Products from "./mainPages/Products";
import AddProduct from "./mainPages/AddProduct";
import LoginForm from "./mainPages/LoginForm";
import Login from "./mainPages/Login";
import Help from "./mainPages/Help";
import ChatContainer from "./mainPages/ChatContainer";



function Main() {

    const [secoundMenu, setSecoundMenu] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [isIcon, setIsIcon] = useState(true);

    useEffect(() => {

    }, [isOpen]);


    const handleClick = () => {

        if (isOpen) {
            setIsOpen(!isOpen);

            setTimeout(() => {
                setIsIcon(!isIcon)
            }, 450)
        } else {
            setIsOpen(!isOpen);

            setTimeout(() => {
                setIsIcon(!isIcon)
            }, 350)
        }
    }


    return (
        <Router>
            <div className="full">
                <div className={isOpen ? "body" : "body-slimMenu"}>

                    <nav className="wholeContainer">

                        <Routes>
                            <Route path="/dodajProdukt" element={<AddProduct/>}/>
                            <Route path="/Produkty" element={<Products/>}/>
                            <Route path="/edycjaKonta" element={<EditAccount/>}/>
                            <Route path="/" element={<Fridge/>}/>
                            <Route path="/HistoriaZakupow" element={<History/>}/>
                            <Route path="/Sklepy" element={<Shops/>}/>
                            <Route path="/Konto" element={<Account/>}/>
                            <Route path="/Powiadomienia" element={<Notifications/>}/>
                            <Route path="/Sklepy" element={<Fridge/>}/>
                            <Route path="/Ustawienia" element={<History/>}/>
                            <Route path="/Pomoc" element={<Help/>}/>
                            <Route path="/Wyloguj" element={<Logout/>}/>
                            <Route path="/Zaloguj" element={<Fridge/>}/>
                            <Route path="/Chatbot" element={<ChatContainer/>}/>


                        </Routes>
                    </nav>


                    <div className="space">

                        <nav className={isOpen ? "menu" : "slimMenu"}>
                            <div className="navExpandButton">
                                <button onClick={handleClick}>{isIcon ?
                                    <Icon icon="material-symbols:arrow-forward-ios"/> :
                                    <Icon icon="material-symbols:arrow-back-ios-new"/>} </button>
                            </div>
                            <Link to="/">
                                <div className="logoContainer">
                                    <img src={logo} alt="Your Image" className={isIcon ? "logo" : "smallLogo"}/>
                                </div>
                            </Link>

                            {secoundMenu && (
                                <div className={secoundMenu ? "visible" : "invisible"}>

                                    <div className="menuNav">
                                        <Link to="/Sklepy">
                                            <div className="navDivMain">
                                                {isIcon ? <h3>sklepy</h3> :
                                                    <Icon className="menuIcons" icon="mdi:shop-find"/>}
                                            </div>
                                        </Link>
                                        <Link to="/Ustawienia">
                                            <div className="navDivMain">
                                                {isIcon ? <h3>ustawienia</h3> :
                                                    <Icon className="menuIcons"
                                                          icon="fa6-solid:screwdriver-wrench"/>}
                                            </div>
                                        </Link>
                                        <Link to="/Pomoc">
                                            <div className="navDivMain">
                                                {isIcon ? <h3>pomoc</h3> :
                                                    <Icon className="menuIcons" icon="solar:help-linear"/>}
                                            </div>
                                        </Link>
                                        <Link to="/Produkty">
                                            <div className="navDivMain">
                                                {isIcon ? <h3>Produkty</h3> :
                                                    <Icon className="menuIcons"
                                                          icon="streamline:shopping-bag-hand-bag-1-shopping-bag-purse-goods-item-products"/>}
                                            </div>
                                        </Link>
                                        <Link to="/dodajProdukt">
                                            <div className="navDivMain">
                                                {isIcon ? <h3>Dodaj produkt</h3> :
                                                    <Icon className="menuIcons" icon="fluent:add-28-filled"/>}
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


                                        <div className="navDivMain">
                                            <Link to="/Wyloguj">{isIcon ? <h3>wyloguj</h3> :
                                                <Icon className="menuIcons" icon="grommet-icons:logout"/>}</Link>
                                        </div>

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
                                        <Link to="/HistoriaZakupow">
                                            <div className="navDiv">
                                                {isIcon ? <h3>historia zakupów</h3> :
                                                    <Icon className="menuIcons"
                                                          icon="material-symbols:history-rounded"/>}
                                            </div>
                                        </Link>
                                        <Link to="/Sklepy">
                                            <div className="navDiv">
                                                {isIcon ? <h3>sklepy</h3> :
                                                    <Icon className="menuIcons" icon="mdi:shop-find"/>}
                                            </div>
                                        </Link>
                                        <Link to="/Konto">
                                            <div className="navDiv">
                                                {isIcon ? <h3>konto</h3> : <Icon className="menuIcons"
                                                                                 icon="material-symbols:account-circle-outline"/>}
                                            </div>
                                        </Link>
                                        <Link to="/Powiadomienia">
                                            <div className="navDiv">
                                                {isIcon ? <h3> powiadomienia</h3> :
                                                    <Icon className="menuIcons"
                                                          icon="ic:baseline-notifications"/>}
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

                                    </div>

                                </div>
                            </div>

                        </nav>

                    </div>
                </div>
            </div>
        </Router>
    )
}

export default Main;