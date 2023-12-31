export function GetBorderStyle(data, filter, int) {
    let borderStyle = {};

    try {
        if (data) {


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

            }
            if (filter === 'old') {
                borderStyle = `${int}px solid black`;
            }
            console.log(borderStyle)
            return borderStyle;
        }


    } catch (error) {
        console.error("Error in GetBorderStyle:", error);
    }

    return borderStyle;
}