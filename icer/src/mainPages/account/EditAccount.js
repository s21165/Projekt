import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import './Account.css';
import './editAccount.css';
import face from "../../data/face.jpg";
import { AuthContext } from "./auth-context";
import axios from "axios";
import {API_URL} from "../../config";




function EditAccount(props) {
    const { user } = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;

    const [formData, setFormData] = useState({
        username: '',
        email: props.email,
        new_password: ''
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${API_URL}/api/edit_user`, {
                new_username: formData.username,
                new_password: formData.new_password,
                sessionId: sessionId
            });

            if (response.data.message) {
                alert(response.data.message);
            } else if (response.data.error) {
                alert(response.data.error);
            }
        } catch (error) {
            alert(`Wystąpił błąd podczas aktualizacji konta: ${error}`);
        }
    };


    return (
        <div className="accountContainer">
            <div className="accountInfo">
                <div className="accountPhoto">
                    <img src={face} alt="Your Image" className="accountPhotoImage" />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="accountName">
                        <h3>
                            Username:
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </h3>
                    </div>
                    <div className="accountPassword">
                        <h3>
                            New Password:
                            <input
                                type="password" // użyj typu password, aby ukryć wpisywane hasło
                                name="new_password"
                                value={formData.new_password}
                                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                            />
                        </h3>
                    </div>
                    {/*<div className="accountPhone">*/}
                    {/*    <h3>*/}
                    {/*        Phone:*/}
                    {/*        <input*/}
                    {/*            type="tel"*/}
                    {/*            name="phone"*/}
                    {/*            value={formData.phone}*/}
                    {/*            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}*/}
                    {/*        />*/}
                    {/*    </h3>*/}
                    {/*</div>*/}
                    <div className="editAccount">
                        <button  type="submit"><h3>Zapisz zmiany</h3></button>
                        <Link to="/konto">
                            <button type= "button"><h3>Anuluj</h3></button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default EditAccount;