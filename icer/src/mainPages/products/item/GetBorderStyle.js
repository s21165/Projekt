
//funkcja, która zwraca wartość obramowania względem wartości zależnej od daty i filtra, przyjmuje dane, filtr, liczbę int
export function GetBorderStyle(data, filter, int) {

    //tworzymy zmienną
    let borderStyle = {};

    try {
        //jeśli są dane to
        if (data) {

            // wzależności od wartości data.trzecia_wartosc nadaj odpowiedni styl
            switch (data.trzecia_wartosc) {
                case 1:
                    borderStyle = `${int}px solid pink`;
                    break;
                case 2:
                    borderStyle = `${int}px solid blue`;
                    break;
                case 3:
                    borderStyle = `${int}px solid green`;
                    break;
                case 4:
                    borderStyle = `${int}px solid red`;
                    break;
                default:

            }//jeśli filter = 'old' obramówka ma być czarna
            if (filter === 'old') {
                borderStyle = `${int}px solid black`;
            }
            //zwróć styl
            return borderStyle;
        }
        //w razie niepowodzeń wyświetl error z serwera w konsoli
    } catch (error) {
        console.error("Error in GetBorderStyle:", error);
    }
    //zwróć styl
    return borderStyle;
}