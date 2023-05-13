import './App.css';
import logo from './data/logo.svg'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
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
import 'bootstrap/dist/css/bootstrap.min.css';
import Logout from "./mainPages/Logout";
import EditAccount from "./mainPages/EditAccount";

import {Button, Nav, Navbar} from "react-bootstrap";

function App() {

    const [secoundMenu, setSecoundMenu] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [isIcon, setIsIcon] = useState(true);

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
            <Container fluid className="contener" >
                <Row noGutters className="vh-100">
                    <Col xs={10} sm={10} md={10} lg={10} className="border overflow-x: auto">
                        <Routes>
                            <Route path="/edycjaKonta" element={<EditAccount/>}/>
                            <Route path="/" element={<Fridge/>}/>
                            <Route path="/HistoriaZakupow" element={<History/>}/>
                            <Route path="/Sklepy" element={<Shops/>}/>
                            <Route path="/Konto" element={<Account/>}/>
                            <Route path="/Powiadomienia" element={<Notifications/>}/>
                            <Route path="/Sklepy" element={<Fridge/>}/>
                            <Route path="/Ustawienia" element={<History/>}/>
                            <Route path="/Pomoc" element={<Shops/>}/>
                            <Route path="/Wyloguj" element={<Logout/>}/>

                        </Routes>

                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2} className="m-0 p-0 overflow-x: auto">
                        <Container className="  position-relative ">
                            <Container className="navExbandButton">
                                <Col xs={1.5} sm={1.5} md={1.5} lg={1.5} className="border">
                                <Button className="position-relative img-fluid" size="sm" onClick={handleClick}>{isIcon ?
                                    <Icon className="res" icon="material-symbols:arrow-forward-ios"/> :
                                    <Icon className="butto" icon="material-symbols:arrow-back-ios-new"/>} </Button>
                                </Col>

                            </Container>
                            <Container className="justify-content-center" >
                                        <Image src={logo} alt="Your Image" fluid className={" justify-content-center custom-image  "} />
                            </Container>
                            <Container className=" m-0 p-0 justify-content-center">
                                <Container className=" justify-content-center">
                                    {secoundMenu && (
                                        <Container className={secoundMenu ? "visible" : "invisible"}>

                                            <Container className="menuNav">
                                                <Container className="navDivMain">
                                                    <Container >{isIcon ? <h3>sklepy</h3> :
                                                        <Icon className="menuIcons" icon="mdi:shop-find"/>}
                                                    </Container>
                                                   </Container>
                                                <Container className="navDivMain">
                                                    <Link to="/Ustawienia">{isIcon ? <h3>ustawienia</h3> :
                                                        <Icon className="menuIcons"
                                                              icon="fa6-solid:screwdriver-wrench"/>}</Link>
                                                </Container>
                                                <Container className="navDivMain">
                                                    <Link to="/Pomoc">{isIcon ? <h3>pomoc</h3> :
                                                        <Icon className="menuIcons" icon="solar:help-linear"/>}</Link>
                                                </Container>

                                                <Container className="navDivMain">

                                                    <Button className="menuNavButton"
                                                            onClick={() => {
                                                                setSecoundMenu(!secoundMenu)
                                                            }}
                                                    >{isIcon ? <h3>menu</h3> :
                                                        <Icon className="menuIcons" icon="mdi:menu-up-outline"/>}
                                                    </Button>


                                                </Container>

                                                <Container className="navDivMain">
                                                    <Link to="/Wyloguj">{isIcon ? <h3>wyloguj</h3> :
                                                        <Icon className="menuIcons" icon="grommet-icons:logout"/>}</Link>
                                                </Container>
                                            </Container>
                                        </Container>
                                    )  }
                                    {!secoundMenu && (
                                    <Container className={secoundMenu ? "invisible" : "visible"}>
                                        <Container className="menuNav">

                                                <Container className="navDiv justify-content-center">
                                                    <Link to="/">{isIcon ? <h3>lodówka</h3> :
                                                        <Icon className="menuIcons navbar-toggler-icon" icon="tabler:fridge"/>}</Link>
                                                </Container>
                                                <Container className="navDiv">
                                                    <Link to="/HistoriaZakupow">{isIcon ? <h3>historia zakupów</h3> :
                                                        <Icon className="menuIcons"
                                                              icon="material-symbols:history-rounded"/>}</Link>
                                                </Container>
                                                <Container className="navDiv">
                                                    <Link to="/Sklepy">{isIcon ? <h3>sklepy</h3> :
                                                        <Icon className="menuIcons" icon="mdi:shop-find"/>}</Link>
                                                </Container>
                                                <Container className="navDiv">
                                                    <Link to="/Konto">{isIcon ? <h3>konto</h3> : <Icon className="menuIcons"
                                                                                                       icon="material-symbols:account-circle-outline"/>}</Link>
                                                </Container>
                                                <Container className="navDiv">
                                                    <Link to="/Powiadomienia"> {isIcon ?<Icon className="menuIcons" icon="ic:baseline-notifications"/> : <h3> powiadomienia</h3>
                                                        }</Link>
                                                </Container>
                                                <Container className="navDiv">
                                                    <Button className="menuNavButton"
                                                            onClick={() => {
                                                                setSecoundMenu(!secoundMenu)
                                                            }}
                                                    >{isIcon ? <h3>menu</h3> :
                                                        <Icon className="menuIcons" icon="mdi:menu-down-outline"/>}
                                                    </Button>
                                                </Container>

                                            </Container>


                                    </Container>)}




                                </Container>

                            </Container>


                        </Container>
                    </Col>


                </Row>
                <Row>

                </Row>
            </Container>
        </Router>
    )
}

export default App;