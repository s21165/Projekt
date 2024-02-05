
//hook zmieniający format daty na polski
export const formatDate = (dateString) => {

    //struktura, w którą opakowujemy przyjmowane dane
    const options = { day: 'numeric', month: 'long', year: 'numeric' };

    //zwracana struktura z danymi
    return new Date(dateString).toLocaleDateString('pl-PL', options);
};
