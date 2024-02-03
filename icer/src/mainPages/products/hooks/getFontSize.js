export const getFontSize=(mediumProductsCountSetting, maxDimension)=>{
    switch (mediumProductsCountSetting) {
        case 0:
            return maxDimension * 1 / 70; // przykładowy stosunek
        case 1:
            return maxDimension * 1 / 60; // dostosuj te proporcje w razie potrzeby
        case 2:
            return maxDimension * 1 / 50;
        case 3:
            return maxDimension * 1 / 40;
        case 4:
            return maxDimension * 1 / 30;
        default:
            return 16; // domyślny rozmiar czcionki, jeśli żaden z przypadków nie pasuje
    }
}
