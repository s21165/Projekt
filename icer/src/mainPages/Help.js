import React from 'react';
import logo from "../data/logo.svg";
import {Link} from "react-router-dom";
import './Help.css';
import {Icon} from "@iconify/react";
import {Advert} from "./advert/Advert";
function Help({isMinimized}){


    return(
    <>
        <div>
            <h1>Pomoc</h1>
            <h2>Jak zacząć?</h2>
            <p>Tutaj umieść krótki przewodnik, jak zacząć korzystać z Twojej aplikacji.</p>
            <h2>Jak korzystać z funkcji XYZ?</h2>
            <p>Tutaj dodaj wyjaśnienia dotyczące specyficznej funkcji Twojej aplikacji.</p>
            <h2>FAQ</h2>

            <p>
                <b>Pytanie 1:</b> Odpowiedź na pytanie 1.
            </p>
            <p>
                <b>Pytanie 2:</b> Odpowiedź na pytanie 2.
            </p>
            <h2>Kontakt z nami</h2>
            <p>Jeżeli potrzebujesz dodatkowej pomocy, skontaktuj się z nami przez e-mail: pomoc@example.com</p>
        </div>


    </>
);
}
export default Help;