
//zapisuje zdjęcie, tworzy do niego podgląd i konwertuje na format base64 i dodaje do produktu do dodania
export const handleImageChange = (e, setImage, setProduct, setImagePreview) => {
    const file = e.target.files[0];
    if (file) {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));

        // Conversion of image to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setProduct(prevState => ({ ...prevState, imageData: reader.result }));
        };
        reader.readAsDataURL(file);
    }
};
