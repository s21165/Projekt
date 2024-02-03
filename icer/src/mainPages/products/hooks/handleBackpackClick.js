//funkcja do kontroli torby na zakupy - zeskanowanych produktów z kamery
export const handleBackpackClick = (productBackpack,setProduct,setProductBackpack) => {
    if (productBackpack.length > 0) {
        // Wybierz pierwszy produkt z listy
        const selectedProduct = productBackpack[0];

        // Ustaw stan produktu na wybrany produkt
        setProduct(selectedProduct);

        // Usuń wybrany produkt z listy productBackpack
        setProductBackpack(prevBackpack => prevBackpack.filter((_, index) => index !== 0));
    }
};
