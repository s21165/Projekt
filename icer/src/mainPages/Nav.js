import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import {Fridge} from "./Fridge";
import {History} from "./History";
import {Shops} from "./Shops";
import {Account} from "./Account";
import {Notifications} from "./Notifications";
import {Menu} from "./Menu";
import React, {useState} from "react";
import '../App.css';


export default function Nav() {
return (
    <div className="body">

        <Router>

            <nav >
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




            </nav>
            <Routes>

                <Route path="/" element={<Fridge/>}/>
                <Route path="/HistoriaZakupow" element={<History/>}/>
                <Route path="/Sklepy" element={<Shops/>}/>
                <Route path="/Konto" element={<Account/>}/>
                <Route path="/Powiadomienia" element={<Notifications/>}/>
                <Route path="/Menu" element={<Menu/>}/>

            </Routes>
        </Router>
    </div>
);
}