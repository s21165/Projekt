import './App.css';
import  logo from './data/logo.svg'
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
import { Icon } from '@iconify/react';
import React, {useEffect, useState} from "react";

import Logout from "./mainPages/Logout";


function App() {

    const [secoundMenu, setSecoundMenu] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [isIcon, setIsIcon] = useState(true);

    const handleClick = () => {

        if(isOpen){
            setIsOpen(!isOpen);

            setTimeout(()=>{
                setIsIcon(!isIcon)
            },450)
        }else{
            setIsOpen(!isOpen);

            setTimeout(()=>{
                setIsIcon(!isIcon)
            },350)
        }
    }


    return (
        <Router>
            <div className={isOpen ? "body" : "body-slimMenu"}>

                <nav className="wholeContainer">

                    <Routes>

                        <Route path="/" element={<Fridge/> }  />
                        <Route path="/HistoriaZakupow" element={<History/>}/>
                        <Route path="/Sklepy" element={<Shops/>}/>
                        <Route path="/Konto" element={<Account/>}/>
                        <Route path="/Powiadomienia" element={<Notifications/>}/>
                        <Route path="/Sklepy" element={<Fridge/>}/>
                        <Route path="/Ustawienia" element={<History/>}/>
                        <Route path="/Pomoc" element={<Shops/>} />
                        <Route path="/Wyloguj" element={<Logout/>} />

                    </Routes>
                </nav>
                <div>


                    <nav className ={isOpen ? "menu" : "slimMenu"}>
                        <div className="navExpandButton">
                            <button onClick={handleClick}>{ isIcon ? <Icon  icon="material-symbols:arrow-forward-ios" /> : <Icon icon="material-symbols:arrow-back-ios-new" />} </button>
                        </div>
                        <div className="logoContainer">
                            <img src={logo} alt="Your Image" className={isIcon ? "logo" : "smallLogo"}/>
                        </div>

                        {secoundMenu && (
                            <div  className={secoundMenu ? "visible" : "invisible"}>

                                <div className="menuNav">
                                    <div className="navDivMain" >
                                        <Link to="/Sklepy">{ isIcon ? <h3>sklepy</h3> : <Icon className="menuIcons" icon="mdi:shop-find" />}</Link>
                                    </div>
                                    <div className="navDivMain">
                                        <Link to="/Ustawienia">{isIcon ? <h3>ustawienia</h3> : <Icon className="menuIcons" icon="fa6-solid:screwdriver-wrench" />}</Link>
                                    </div>
                                    <div className="navDivMain">
                                        <Link to="/Pomoc">{isIcon ? <h3>pomoc</h3> : <Icon className="menuIcons" icon="solar:help-linear" />}</Link>
                                    </div>

                                    <div className="navDivMain">

                                        <button className="menuNavButton"
                                                onClick={() => {
                                                    setSecoundMenu(!secoundMenu)
                                                }}
                                        >{isIcon ? <h3>menu</h3> : <Icon className="menuIcons" icon="mdi:menu-up-outline" />}
                                        </button>


                                    </div>

                                    <div className="navDivMain">
                                        <Link to="/Wyloguj">{isIcon ? <h3>wyloguj</h3> : <Icon className="menuIcons" icon="grommet-icons:logout" />}</Link>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className={secoundMenu ? "invisible" : "visible"}>
                            <div className="menuNav">
                                <div>
                                    <div className="navDiv" >
                                        <Link to="/">{isIcon ?<h3>lodówka</h3> :<Icon className="menuIcons" icon="tabler:fridge" />}</Link>
                                    </div>
                                    <div className="navDiv">
                                        <Link to="/HistoriaZakupow">{isIcon ?<h3>historia zakupów</h3> : <Icon className="menuIcons" icon="material-symbols:history-rounded" />}</Link>
                                    </div>
                                    <div className="navDiv">
                                        <Link to="/Sklepy">{isIcon ?<h3>sklepy</h3> : <Icon className="menuIcons" icon="mdi:shop-find" />}</Link>
                                    </div>
                                    <div className="navDiv">
                                        <Link to="/Konto">{isIcon ? <h3>konto</h3> : <Icon className="menuIcons" icon="material-symbols:account-circle-outline" />}</Link>
                                    </div>
                                    <div className="navDiv">
                                        <Link to="/Powiadomienia"> {isIcon ? <h3> powiadomienia</h3> : <Icon className="menuIcons" icon="ic:baseline-notifications" /> }</Link>
                                    </div>
                                    <div className="navDiv">
                                        <button className="menuNavButton"
                                                onClick={() => {
                                                    setSecoundMenu(!secoundMenu)
                                                }}
                                        >{isIcon ?<h3>menu</h3>: <Icon className="menuIcons" icon="mdi:menu-down-outline" />}
                                        </button>
                                    </div>

                                </div>

                            </div>
                        </div>

                    </nav>


                </div>

            </div>
        </Router>
    )
}

export default App;