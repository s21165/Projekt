import {useContext, useEffect, useState} from "react";
import noImage from "../../../data/userProfilePicture/face.jpg";
import SettingsContext from "../../settings/SettingsContext";

//hook, który zwraca zdjęcie użytkownika
//przyjmuje obraz, ustawienie obrazu, zdjęcie - z serwera
export const AccountPictureGetter = (image, setImage, defaultProfile, profilePicture) => {


    useEffect(() => {

        try {
            if (defaultProfile===1) {
                setImage(noImage);

            } else

                setImage(require(`../../../data/userProfilePicture/${profilePicture}`));


        } catch (e) {
            console.error("Nie udało się załadować obrazu: ", e);
            // Ustaw domyślny obraz, jeśli nie można załadować obrazu z danej lokalizacji
            setImage(noImage);
        }
    }, [image,defaultProfile, profilePicture]);
    return (image)
}