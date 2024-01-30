
export const handleUserImageChange = (e, setImage, setPictureToSend, setImagePreview) => {
    const file = e.target.files[0];
    if (file) {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));

        // Conversion of image to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setPictureToSend({image_data_base64: reader.result});
        };
        reader.readAsDataURL(file);
    }
};
