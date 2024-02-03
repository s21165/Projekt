//funkcja do ustawiania zdjęcia do identyfikacji i jego podglądu, przyjmuje event, ustawienie obrazka do identyfikacji,
// oraz jego podglądu, zmienną która określa czy widać dodatkowe opcje identyfikacji i ustawienie opcji pierwszej
export const chooseImageForIdentyfiaction = (event,setImageIdentyfication, setImageForIdentyficationURL
        ,setShowCameraOptions, setOneIdCameraOptions) => {
    //jeśli wybrany jest plik to przypisz go do imageFile
    if (event.target.files && event.target.files[0]) {
        const imageFile = event.target.files[0];

        //przypisz imageFile do imageIdentyfiaction
        setImageIdentyfication(imageFile);

        //stwórz z imageFile podgląd url i przypisz go do imageForIdentyficationURL
        setImageForIdentyficationURL(URL.createObjectURL(imageFile));

        //wyłącz opcje
        setShowCameraOptions(false)
        setOneIdCameraOptions(false)
    }

}