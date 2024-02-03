import {useState} from 'react';

//funkcja, która dodaje wartość do funkcji akcji na produktach, stopPropagition() co w rezultacie oznacza, że przy kliknięciu
//na te funkcje kliknięcie nie będzie rozpoznawane jako akcja wykonana poprze event. Przyjmuje wartości: dane, funkcje
// do kontroli stanu produktów czyli odejmowanie ilości, usuwanie produktu, zaznaczanie, że został wybranyt oraz zerowanie ilości
export const useProductItem = (data, handleDecrease, handleIncrease,setIsSelected,handleZero) => {

    //w zależności od tej zmiennej będzie widoczne pytanie czy na pewno przenieść produkt do listy produktów wyczerpanych
    const [showRemovalConfirmation, setShowRemovalConfirmation] = useState(false);
    //

    //zmniejszanie ilości z pytaniem czy na pewno przenieść element do listy produktów wyczerpanych kiedy jego ilość ma spaść
    //do zera
    const handleDecreaseWithCheck = (event) => {
        event.stopPropagation();
        if (data.ilosc === 1) {
            setShowRemovalConfirmation(true);
        } else {
            handleDecrease(data.id);
        }
    };

    //dodanie ilości
    const handleIncreaseItem = (event) => {
        event.stopPropagation();
        handleIncrease(data.id);
    };

    //przeniesienie do produktów wyczerpanych - zerowanie ilości
    const handleRemoveItem = (event) =>{
        event.stopPropagation();
        handleZero(data.id);
    }

    //potwierdzenie pytania czy kontynuować i przenieść element do listy produktów wyczerpanych
    const confirmRemoval = (event) => {
        event.stopPropagation();
        handleDecrease(data.id);
        setShowRemovalConfirmation(false);
        setIsSelected(null) //zmieniamy

    };

    //odrzucenie pytania czy kontynuować i przenieść element do listy produktów wyczerpanych
    const declineRemoval = (event) => {
        event.stopPropagation();
        setShowRemovalConfirmation(false);
    };

    return {
        showRemovalConfirmation,
        setShowRemovalConfirmation,
        handleDecreaseWithCheck,
        handleRemoveItem,
        handleIncreaseItem,
        confirmRemoval,
        declineRemoval
    };
};
