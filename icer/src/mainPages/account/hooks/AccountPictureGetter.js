import {useEffect} from "react";
import noImage from "../../../data/userProfilePicture/face.jpg";

//hook, który zwraca zdjęcie użytkownika
//przyjmuje obraz, ustawienie obrazu, zdjęcie - z serwera
export const AccountPictureGetter=(image, setImage, photo)=>{


    useEffect(()=>{
        try {
            //jeśli nie ma zdjęcia w bazie danych to wyrzuca komunikat
            if (!photo){  throw 'zdjęcie nie istnieje'


            }else
                //jeśli jest zdjęcie w bazie danych to ustawia je jako image z folderu zdjęć profilu użytkownika
                setImage(require(`../../../data/userProfilePicture/${photo}`));
                console.log(photo)
        } catch (e) {
            // w razie erroru pokazuje komunikat z serwera w konsoli
            console.error("Nie udało się załadować obrazu: ", e);
            // Ustaw domyślny obraz

        }
    },[photo]); // ma się wykonywać ponownie jeśli zmieniony zostaje parametr photo
    return(image) // zwraca zmienną image
}