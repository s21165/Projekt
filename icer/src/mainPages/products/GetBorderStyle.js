export function GetBorderStyle(data, filter, int) {
    let borderStyle = {};

    try {
        if (data) {


            switch (data.trzecia_wartosc) {
                case 1:
                    borderStyle = {border: `${int}px solid pink`};
                    break;
                case 2:
                    borderStyle = {border: `${int}px solid blue`};
                    break;
                case 3:
                    borderStyle = {border: `${int}px solid green`};
                    break;
                case 4:
                    borderStyle = {border: `${int}px solid red`};
                    break;
                default:

            }
            if (filter === 'old') {
                borderStyle = {border: `${int}px solid black`};
            }

            return borderStyle;
        }


    } catch (error) {
        console.error("Error in GetBorderStyle:", error);
    }

    return borderStyle;
}