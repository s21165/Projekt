import './App.css';
import { animateScroll as scroll } from "react-scroll";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link, useLocation
} from "react-router-dom";
import {Fridge} from "./mainPages/Fridge";
import {History} from "./mainPages/History";
import {Shops} from "./mainPages/Shops";
import {Account} from "./mainPages/Account";
import {Notifications} from "./mainPages/Notifications";

import React, {useEffect, useState} from "react";

import Logout from "./mainPages/Logout";


function App(props) {

    const [isNavExpanded, setIsNavExpanded] = useState(false);



    return (
        <Router>
        <div className="body">

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

                <nav className ="menu">

                    {isNavExpanded && (
                        <div  className={isNavExpanded ? "visible" : "invisible"}>

                            <div className="menuNav">
                                <div className="navDiv" >
                                    <Link to="/Sklepy"><h3>sklepy</h3></Link>
                                </div>
                                <div className="navDiv">
                                    <Link to="/Ustawienia"><h3>ustawienia</h3></Link>
                                </div>
                                <div className="navDiv">
                                    <Link to="/Pomoc"><h3>pomoc</h3></Link>
                                </div>

                                <div className="navDiv">

                                        <button className="menuNavExpandButton"
                                                onClick={() => {
                                                    setIsNavExpanded(!isNavExpanded)
                                                }}
                                        ><h3>menu</h3>
                                        </button>


                                </div>

                                <div className="navDiv">
                                    <Link to="/Wyloguj"><h3>wyloguj</h3></Link>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className={isNavExpanded ? "invisible" : "visible"}>
                        <div className="menuNav">
                            <div>
                                <div className="navDiv" >
                                    <Link to="/"><h3>lodówka</h3></Link>
                                </div>
                                <div className="navDiv">
                                    <Link to="/HistoriaZakupow"><h3>historia zakupów</h3></Link>
                                </div>
                                <div className="navDiv">
                                    <Link to="/Sklepy"><h3>sklepy</h3></Link>
                                </div>
                                <div className="navDiv">
                                    <Link to="/Konto"> <h3>konto</h3></Link>
                                </div>
                                <div className="navDiv">
                                    <Link to="/Powiadomienia"> <h3>powiadomienia</h3></Link>
                                </div>
                                <button className="menuNavExpandButton"
                                        onClick={() => {
                                            setIsNavExpanded(!isNavExpanded)
                                        }}
                                ><h3>menu</h3>
                                </button>

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