import React, {useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import './Account.css';
import face from "../../data/face.jpg";
import {AuthContext} from "./auth-context";
import SettingsContext from "../settings/SettingsContext";
import {AccountPictureGetter} from "./hooks/AccountPictureGetter";
import settingsContext from "../settings/SettingsContext";
import noImage from "../../data/userProfilePicture/face.jpg";
import axios from "axios";
import {API_URL} from "../settings/config";
//Funcja przedstawiająca stronę konta użytkownika
export function Account() {

    //pobieramy informacje na temat aktualnego użytkownika
    const {user} = useContext(AuthContext);
    const {profilePicture,defaultProfile,refresh} = useContext(SettingsContext);
    const [image,setImage]= useState()
    useEffect(() => {

    },[refresh,profilePicture,defaultProfile,defaultProfile,image,setImage]);

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

