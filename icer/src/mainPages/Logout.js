import React, {useContext} from 'react';
import {AuthContext} from "./auth-context";

function Logout() {

    const { logout } = useContext(AuthContext);
    const handleLogout = () => {
        logout();
    };
    return (
        <div><button onClick={handleLogout}>logout</button></div>
    );
}

export default Logout;