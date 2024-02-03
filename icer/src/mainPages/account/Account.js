import React, {useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import './Account.css';
import {AuthContext} from "./auth-context";
import SettingsContext from "../settings/SettingsContext";
import {AccountPictureGetter} from "./hooks/AccountPictureGetter";

//Funcja przedstawiająca stronę konta użytkownika
export function Account() {

    //pobieramy informacje na temat aktualnego użytkownika
    const {user} = useContext(AuthContext);
    //pobieramy nazwę zdjęcia, informację czy jest zdjęcie podstawowe oraz zmienną, której zmiana to odświeżenie ustawień.
    const {profilePicture,defaultProfile,refresh} = useContext(SettingsContext);
    //inicjacja obrazka
    const [image,setImage]= useState()
    useEffect(() => {

        //odświeżamy po zmianie jednej z tych wartości
    },[refresh,profilePicture,defaultProfile,defaultProfile,image,setImage]);

    // tworzymy instancje AccountPictureGetter, która decyduje jakie zdjęcie zwrócić na podstawie podanych informacji
    const picGetter = AccountPictureGetter(image,setImage, defaultProfile , profilePicture)
    return (
        <div className="accountContainer"> {/*kontener z informacjami o użytkowniku oraz z przyciskiem edycji konta*/}
            <div className="accountInfo"> {/*kontener ze zdjęciem oraz informacjami o użytkowniku*/}
                <div className="accountPhoto"> {/*kontener ze zdjęciem użytkownika*/}
                    <img src={picGetter} className="accountPhotoImage"/> {/*zdjęcie użytkownika*/}

                </div>
                <div className="accountName"> {/*kontener z informacjami o użytkowniku*/}
                    <h3>{user.username} </h3>
                </div>

                <div className="editAccount"> {/*kontener z linkiem do edycji konta*/}
                    <Link to="/edycjaKonta">
                        <button><h3>edytuj konto</h3></button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

