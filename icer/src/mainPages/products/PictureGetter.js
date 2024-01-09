import {useEffect} from "react";
import noImage from "../../data/noImage/1.jpg";

export const PictureGetter=(image, setImage, photo)=>{

    useEffect(()=>{
        try {
            setImage(require(`../../data/${photo}`));
        } catch (e) {
            console.error("Nie udało się załadować obrazu: ", e);
            // Ustaw domyślny obraz, jeśli nie można załadować obrazu z danej lokalizacji
            setImage(noImage);
        }
    });
    return(image)
}