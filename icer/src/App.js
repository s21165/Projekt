import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import {Fridge} from "./mainPages/Fridge";
import {History} from "./mainPages/History";
import {Shops} from "./mainPages/Shops";
import {Account} from "./mainPages/Account";
import {Notifications} from "./mainPages/Notifications";
import {Menu} from "./mainPages/Menu";
import React, {useState} from "react";

import MainNav from "./mainPages/MainNav";

function App() {

    const [isNavExpanded, setIsNavExpanded] = useState(false);

    const mainNav = () => {

            return (
                <div className="body">
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
                        >xxx
                        </button>

                    </nav>

                </div>
            )
        }
        const menuNav = () =>{

               return(
                <div>
                    <div className="menuNav">
                        <div className="menuNavDiv">
                            <Link to="/Sklepy">Sklepy</Link>
                        </div>
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
                </div>
               )

        }
        return (

            <div className="body">

                <Router>
                    {{isNavExpanded} ?
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
                            >xxx
                            </button>
                        </nav>
                        : <div className="menuNav">
                            <div className="menuNavDiv">
                                <Link to="/Sklepy">Sklepy</Link>
                            </div>
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
                    }
                    <Routes>

                        <Route path="/" element={<Fridge/>}/>
                        <Route path="/HistoriaZakupow" element={<History/>}/>
                        <Route path="/Sklepy" element={<Shops/>}/>
                        <Route path="/Konto" element={<Account/>}/>
                        <Route path="/Powiadomienia" element={<Notifications/>}/>
                        <Route path="/Menu" element={<Menu/>}/>
                        <Route path="/Sklepy" element={<Fridge/>}/>
                        <Route path="/Ustawienia" element={<History/>}/>
                        <Route path="/Pomoc" element={<Shops/>}/>
                        <Route path="/Wyloguj" element={<Account/>}/>


                    </Routes>
                </Router>
            </div>


        )
    }

    export default App;