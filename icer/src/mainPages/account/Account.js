import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import './Account.css';
import face from "../../data/face.jpg";
import {AuthContext} from "./auth-context";
export function Account(props){

    const {user} = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;

    return (
        <div className="accountContainer">
        <div className="accountInfo">
            <div className="accountPhoto">
                <img src={face}className="accountPhotoImage" />

            </div>
            <div className="accountName">
                <h3>{user.username} </h3>
            </div>
            {/*<div className="accountMail">*/}
            {/*    <h3>Email: {props.email}</h3>*/}
            {/*</div>*/}
            {/*<div className="accountPhone">*/}
            {/*    <h3>Phone: {props.phone}</h3>*/}
            {/*</div>*/}

            <div className="editAccount">
                <Link to="/edycjaKonta"><button><h3 >edytuj konto</h3></button></Link>
            </div>
        </div>
        </div>
    );
}

