export const handleQRChange = (e, setQrImage, setQrImagePreview) => {
    const file = e.target.files[0];
    if (file) {
        setQrImage(file);
        setQrImagePreview(URL.createObjectURL(file));


    }
};
