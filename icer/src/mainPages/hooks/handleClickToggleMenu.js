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

