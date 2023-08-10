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
                            <Route path="/Zaloguj" element={<Login/>}/>


                        </Routes>
                    </nav>


                    <div className="space">

                        <nav className={isOpen ? "menu" : "slimMenu"}>
                            <div className="navExpandButton">
                                <button onClick={handleClick}>{isIcon ?
                                    <Icon icon="material-symbols:arrow-forward-ios"/> :
                                    <Icon icon="material-symbols:arrow-back-ios-new"/>} </button>
                            </div>
                            <div className="logoContainer">
                                <img src={logo} alt="Your Image" className={isIcon ? "logo" : "smallLogo"}/>
                            </div>

                            {secoundMenu && (
                                <div className={secoundMenu ? "visible" : "invisible"}>

                                    <div className="menuNav">
                                        <div className="navDivMain">
                                            <Link to="/Sklepy">{isIcon ? <h3>sklepy</h3> :
                                                <Icon className="menuIcons" icon="mdi:shop-find"/>}</Link>
                                        </div>
                                        <div className="navDivMain">
                                            <Link to="/Ustawienia">{isIcon ? <h3>ustawienia</h3> :
                                                <Icon className="menuIcons"
                                                      icon="fa6-solid:screwdriver-wrench"/>}</Link>
                                        </div>
                                        <div className="navDivMain">
                                            <Link to="/Pomoc">{isIcon ? <h3>pomoc</h3> :
                                                <Icon className="menuIcons" icon="solar:help-linear"/>}</Link>
                                        </div>
                                        <div className="navDivMain">
                                            <Link to="/Produkty">{isIcon ? <h3>Produkty</h3> :
                                                <Icon className="menuIcons"
                                                      icon="streamline:shopping-bag-hand-bag-1-shopping-bag-purse-goods-item-products"/>}</Link>
                                        </div>
                                        <div className="navDivMain">
                                            <Link to="/dodajProdukt">{isIcon ? <h3>Dodaj produkt</h3> :
                                                <Icon className="menuIcons" icon="fluent:add-28-filled"/>}</Link>
                                        </div>

                                        <div className="navDivMain">

                                            <button className="menuNavButton"
                                                    onClick={() => {
                                                        setSecoundMenu(!secoundMenu)
                                                    }}
                                            >{isIcon ? <h3>menu</h3> :
                                                <Icon className="menuIcons" icon="mdi:menu-up-outline"/>}
                                            </button>


                                        </div>

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
                                        <div className="navDiv">
                                            <Link to="/">{isIcon ? <h3>lodówka</h3> :
                                                <Icon className="menuIcons" icon="tabler:fridge"/>}</Link>
                                        </div>
                                        <div className="navDiv">
                                            <Link to="/HistoriaZakupow">{isIcon ? <h3>historia zakupów</h3> :
                                                <Icon className="menuIcons"
                                                      icon="material-symbols:history-rounded"/>}</Link>
                                        </div>
                                        <div className="navDiv">
                                            <Link to="/Sklepy">{isIcon ? <h3>sklepy</h3> :
                                                <Icon className="menuIcons" icon="mdi:shop-find"/>}</Link>
                                        </div>
                                        <div className="navDiv">
                                            <Link to="/Konto">{isIcon ? <h3>konto</h3> : <Icon className="menuIcons"
                                                                                               icon="material-symbols:account-circle-outline"/>}</Link>
                                        </div>
                                        <div className="navDiv">
                                            <Link to="/Powiadomienia"> {isIcon ? <h3> powiadomienia</h3> :
                                                <Icon className="menuIcons"
                                                      icon="ic:baseline-notifications"/>}</Link>
                                        </div>
                                        <div className="navDiv">
                                            <button className="menuNavButton"
                                                    onClick={() => {
                                                        setSecoundMenu(!secoundMenu)
                                                    }}
                                            >{isIcon ? <h3>menu</h3> :
                                                <Icon className="menuIcons" icon="mdi:menu-down-outline"/>}
                                            </button>
                                        </div>

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