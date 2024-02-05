import React, {createContext, useEffect, useState} from 'react';

//tworzenie i eksport kontekstu
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    //tworzenie zmiennej przechowującj informacje na temat aktualnego użytkownika
    const [user, setUser] = useState(null);
    const [refreshTrigger,setRefreshTrigger] = useState(false);
    //efekt aktualizujący informacje w zmiennej "user"
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [refreshTrigger]);

    //logowanie
    const login = (userData) => {
        //ustawia wartości do nazwy i sesji użytkownika
        setUser({
            username: userData.username,
            sessionId: userData.sessionId
        });
        //ustawia local storage i zapisuje w nim nazwę i sesję użytkownika
        localStorage.setItem('user', JSON.stringify({
            username: userData.username,
            sessionId: userData.sessionId
        }));
    };

    //wyloguj
    const logout = () => {
        //zmienia użytkownika na 'null'
        setUser(null);
        //usuwa informacje na temat użytkownika z localstorage
        localStorage.removeItem('user');

    };
    //zwraca informacje zawarte w AuthContext swoim dzieciom
    return (

        <AuthContext.Provider value={{ user, login, logout, setRefreshTrigger}}>
            {children}
        </AuthContext.Provider>
    );
};