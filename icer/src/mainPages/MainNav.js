import React, {useState} from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import {Fridge} from "./Fridge";
import {History} from "./History";
import {Shops} from "./Shops";
import {Account} from "./Account";
import {Notifications} from "./Notifications";
import {Menu} from "./Menu";
import '../App.css';
import Nav from "./Nav"

function MainNav() {

    const [isNavExpanded, setIsNavExpanded] = useState(true);


    return (

            <div className="body">

                <Router>
                    {isNavExpanded} ?
                    <nav>
                        <div className="navDiv">
                            <Link to="/">Lodówka</Link>
                        </div>
                        <div className="navDiv">
                            <Link to="/HistoriaZakupow">Historia zakupów</Link>
                        </div>
                        <div className="navDiv">
                            <Link to="/Sklepy">Sklepy</Link>
                        </div>
                        <div className="navDiv">
                            <Link to="/Konto"> Konto</Link>
                        </div>
                        <div className="navDiv">
                            <Link to="/Powiadomienia"> Powiadomienia</Link>
                        </div>
                        <button className="menuNavExpand"
                                onClick={() => {
                                    setIsNavExpanded(!isNavExpanded)
                                }}
                        >xxx</button>
                       : <div className="menuNav">
                        <div className="menuNavDiv">
                            <Link to="/Sklepy">Sklepy</Link>
                        </div >
                        <div className="menuNavDiv">
                            <Link to="/Ustawienia">Ustawienia</Link>
                        </div>
                        <div className="menuNavDiv">
                            <Link to="/Pomoc">Pomoc</Link>
                        </div>

                        <div className="menuNavDiv">
                            <Link to="/Wyloguj">Wyloguj</Link>
                        </div>


                        <div className="menuNavDiv">
                            <Link to="/Menu"> Menu </Link>
                            <button className="menuNavExpand"
                                    onClick={() => {
                                        setIsNavExpanded(!isNavExpanded)
                                    }}
                            ></button>



                        </div>
                    </div>
                    </nav>
                    <Routes>

                        <Route path="/" element={<Fridge/>}/>
                        <Route path="/HistoriaZakupow" element={<History/>}/>
                        <Route path="/Sklepy" element={<Shops/>}/>
                        <Route path="/Konto" element={<Account/>}/>
                        <Route path="/Powiadomienia" element={<Notifications/>}/>
                        <Route path="/Menu" element={<Menu/>}/>
                        <Route path="/Sklepy" element={<Fridge />} />
                        <Route path="/Ustawienia" element={<History />} />
                        <Route path="/Pomoc" element={<Shops/>} />
                        <Route path="/Wyloguj" element={<Account/>} />


                    </Routes>
                </Router>
            </div>

    )
}

export default MainNav;