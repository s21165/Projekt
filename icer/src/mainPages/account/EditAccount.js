import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import './Account.css';
import face from "../../data/face.jpg";
import { AuthContext } from "./auth-context";

function EditAccount(props) {
    const { user } = useContext(AuthContext);
    const sessionId = user ? user.sessionId : null;

    const [formData, setFormData] = useState({
        username: user.username,
        email: props.email,
        phone: props.phone
    });



    const handleSubmit = (event) => {
        event.preventDefault();
        // Tu można wywołać funkcję do aktualizacji danych użytkownika na serwerze
    }

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
                    <div className="accountMail">
                        <h3>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </h3>
                    </div>
                    <div className="accountPhone">
                        <h3>
                            Phone:
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </h3>
                    </div>
                    <div className="editAccount">
                        <button type="submit"><h3>Zapisz zmiany</h3></button>
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