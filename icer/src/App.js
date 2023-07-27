import './App.css';
import React, {useContext} from "react";
import Login from "./mainPages/Login";
import {AuthContext, AuthProvider} from "./mainPages/auth-context";
import Main from "./Main";


function App() {
    const { user } = useContext(AuthContext);
    return (
        <>

                {user ? <Main /> : <Login />}

        </>
    )
}

export default App;