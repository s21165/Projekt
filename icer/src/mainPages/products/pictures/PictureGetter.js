import {useEffect} from "react";
import noImage from "../../../data/noImage/1.jpg";

export const PictureGetter=(image, setImage, photo)=>{

    useEffect(()=>{
        console.log(photo)
        try {
            if (!photo){  throw 'zdjęcie nie istnieje'

            }else

            setImage(require(`../../../data/userPhotos/${photo}`));
            console.log(photo)
        } catch (e) {
            console.error("Nie udało się załadować obrazu: ", e);
            // Ustaw domyślny obraz, jeśli nie można załadować obrazu z danej lokalizacji
            setImage(noImage);
        }
    },[photo]);
    return(image)
}