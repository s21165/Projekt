export function GetBorderStyle(data, filter, int) {
    let borderStyle = {};

    try {
        if (!data) {
            return borderStyle;
        }

        switch(data.trzecia_wartosc) {

            case 0:
                borderStyle = { border: `${int}px solid red` };
                break;
            case 1:
                borderStyle = { border: `${int}px solid yellow` };
                break;
            case 2:
                borderStyle = { border: `${int}px solid blue` };
                break;
            case 3:
                borderStyle = { border: `${int}px solid green` };
                break;
            default:
        }

        if(filter === 'old') {
            borderStyle = {border: `${int}px solid black`};
        }
    } catch (error) {
        console.error("Error in GetBorderStyle:", error);
    }

    return borderStyle;
}