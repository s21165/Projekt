import React from 'react';
import {Link} from "react-router-dom";
import './Account.css';
export function Account(props){
    return (
        <div className="accountInfo">
            <div>
                <h3> zdjęcie</h3>
            </div>
            <div>
                <h3>{props.firstName} {props.lastName}</h3>
            </div>
            <div>
                <h3>Email: {props.email}</h3>
            </div>
            <div>
                <h3>Phone: {props.phone}</h3>
            </div>
            <div>
                <h3>Address: {props.address}</h3>
            </div>
            <div>
                <Link to="/edycjaKonta"><button><h3>edytuj konto</h3></button></Link>
            </div>
        </div>
    );
}

