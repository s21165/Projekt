export const chooseImageForIdentyfiaction = (event,setImageIdentyfication, setImageForIdentyficationURL
        ,setShowCameraOptions, setOneIdCameraOptions) => {
    if (event.target.files && event.target.files[0]) {
        const imageFile = event.target.files[0];
        setImageIdentyfication(imageFile);
        setImageForIdentyficationURL(URL.createObjectURL(imageFile));
        setShowCameraOptions(false)
        setOneIdCameraOptions(false)
    }

}