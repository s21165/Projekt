import {useContext, useEffect, useState} from "react";
import noImage from "../../../data/userProfilePicture/face.jpg";
import SettingsContext from "../../settings/SettingsContext";

//hook, który zwraca zdjęcie użytkownika
//przyjmuje obraz, ustawienie obrazu, zdjęcie - z serwera
export const AccountPictureGetter = (image, setImage, defaultProfile, profilePicture) => {


    useEffect(() => {
            console.log(defaultProfile)
            if (defaultProfile===1) {
                setImage(`${process.env.PUBLIC_URL}/data/userProfilePicture/face.jpg`);

            } else if (profilePicture) {
                console.log(profilePicture)
                setImage(`${process.env.PUBLIC_URL}/data/userProfilePicture/${profilePicture}`);

            }

    }, [image,defaultProfile, profilePicture, setImage]);
    return (image)
}