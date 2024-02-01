
//hook rozwijający i zwijający menu boczne aplikacji, w zależności od wartości isOpen
//otwiera bądź zamyka menu przy czym zamienia nazwy linków na ikony bądź na odwrót
export const handleClickToggleMenu = (isOpen, setIsOpen, isIcon, setIsIcon) => {
    if (isOpen) {
        setIsOpen(!isOpen);
        setTimeout(() => {
            setIsIcon(!isIcon);
        }, 450);
    } else {
        setIsOpen(!isOpen);
        setTimeout(() => {
            setIsIcon(!isIcon);
        }, 350);
    }
};

