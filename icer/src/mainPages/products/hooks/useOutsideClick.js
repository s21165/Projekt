import { useEffect } from 'react';

//funkcja, która przyjmuje referencję i callback, służy do wykonywania zamierzanych akcji po naciśnięciu poza wskazany
// referencją obiekt
export const useOutsideClick = (ref, callback) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback(); // funkcja, która ma zostać wykonana, gdy kliknięcie nastąpi poza elementem wskazanym przez referencję
            }
        };
        //ustawia słuchacza na akcję typu kliknięcie
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            //usuwa słuchacza z akcji typu kliknięcie
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);//odświeża się po zmianie tych wartości
};
