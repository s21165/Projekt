import {useEffect} from "react";
import noImage from "../../../data/userProfilePicture/face.jpg";

export const AccountPictureGetter=(image, setImage, photo)=>{

    useEffect(()=>{
        try {
            if (!photo){  throw 'zdjęcie nie istnieje'

                setImage(noImage);
            }else

                setImage(require(`../../../data/userProfilePicture/${photo}`));

        } catch (e) {
            console.error("Nie udało się załadować obrazu: ", e);
            // Ustaw domyślny obraz, jeśli nie można załadować obrazu z danej lokalizacji
            setImage(noImage);
        }
    },[photo]);
    return(image)
}