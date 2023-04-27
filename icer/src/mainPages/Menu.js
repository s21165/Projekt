import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";

import {Fridge} from "./Fridge";
import {History} from "./History";
import {Shops} from "./Shops";
import {Account} from "./Account";
import './Menu.css';
import React, {useState} from "react";


export function Menu(){

    const [isNavExpanded, setIsNavExpanded] = useState(false);

    return(
        <div>

            <div className="menuNav">
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


            <Routes>

                <Route path="/Sklepy" element={<Fridge />} />
                <Route path="/Ustawienia" element={<History />} />
                <Route path="/Pomoc" element={<Shops/>} />
                <Route path="/Wyloguj" element={<Account/>} />


            </Routes>

        </div>
        </div>
    );
}