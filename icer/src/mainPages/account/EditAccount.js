import React, {useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";

import './editAccount.css';
import face from "../../data/face.jpg";
import {AuthContext} from "./auth-context";
import axios from "axios";
import {API_URL} from "../settings/config";
import {toast} from "react-toastify";
import {handleImageChange} from "../products/pictures/handleImageChange";
import {PictureGetter} from "../products/pictures/PictureGetter";
import {AccountPictureGetter} from "./hooks/AccountPictureGetter";
import {handleUserImageChange} from "./hooks/handleUserImageChange";
import settingsContext from "../settings/SettingsContext";


function EditAccount(props) {
    //pobieramy informacje na temat aktualnego użytkownika
    const {user} = useContext(AuthContext);
    //przypisuję sesję aktualnego użytkownika do zmiennej
    const sessionId = user ? user.sessionId : null;
    const {profilePicture} = useContext(settingsContext);
    const [image,setImage] = useState('');
    const [product,setProduct] = useState('');
    const [pictureToSend,setPictureToSend]= useState('');
    const [imagePreview,setImagePreview]= useState('');
    //ustawiamy podstawowe informacje formularza
    const [formData, setFormData] = useState({
        username: '',
        email: props.email,
        new_password: ''
    });
    const picGetter = AccountPictureGetter(image,setImage,face)
    //asynchroniczna funkcja wywoływana podczas złożenia formularza - przyjmuje event
    const handleSubmit = async (event) => {
        // funkcja, która wstrzymuje automatyczne odświeżenie
        event.preventDefault();

        try {
            //wysyłamy zaktualizowane dane - do edycji
            const response = await axios.post(`${API_URL}/api/edit_user`, {
                new_username: formData.username,
                new_password: formData.new_password,
                sessionId: sessionId
            });
            //jeśli dostaje odpowiedź
            if (response.data.message)
                //powiadomienie
                changeUserPhoto();
                toast.success('dane zostały zaktualizowane');

            // jeśli dostaje error
        } catch (error) {
            //powiadomienie
            toast.success(`Wystąpił błąd podczas aktualizacji konta: ${error}`);

        }
    };
    const changeUserPhoto = () => {
        console.log('poszlo change_user_photo')
        // Znajdź produkt o danym ID i zwiększ jego ilość
        axios.post(`${API_URL}/api/change_user_photo`,
            {sessionId:sessionId,
                image_data_base64:pictureToSend
            } )
            .then((response) => {

                toast.success(`Wszystkie produkty zostały usunięte z listy zakupów!`);
            })
            .catch((error) => {
                console.error(`There was an error retrieving the data: ${error}`);
            });
    };



    return (
        <div className="accountContainer"> {/*kontener z informacjami o użytkowniku oraz z przyciskiem edycji konta*/}
            <div className="accountInfo"> {/*kontener ze zdjęciem oraz informacjami o użytkowniku*/}
                <div className="accountPhoto"> {/*kontener ze zdjęciem użytkownika*/}

                    <img src={picGetter} alt="Your Image" className="accountPhotoImage"/> {/*zdjęcie użytkownika*/}

                    <input
                        type="file"
                        id="file-input2"

                        onChange={(e) => handleUserImageChange(e, setImage, setPictureToSend, setImagePreview)}
                    />

                </div>
                {/* formularz edycji konta */}
                <form onSubmit={handleSubmit}>
                    <div className="accountName"> {/*kontener z polem edycji nazwy użytkownika*/}
                        <h3>
                            Username:
                        </h3>
                        <input /*element wejściowy tworzenia informacji do zaktualizowania nazwy użytkownika*/
                            type="text" //typ wejścia
                            name="username" //nazwa wejścia
                            value={formData.username}  // wyświetlana wartość
                            //aktualizacja pola wejściowego o aktualne informacje w nim zawarte
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />

                    </div>
                    {/*kontener z polem edycji hasła użytkownika*/}
                    <div className="accountPassword">
                        <h3>
                            New Password:
                        </h3>
                        <input /*element wejściowy tworzenia informacji do zaktualizowania hasła użytkownika*/
                            type="password" // użycie typu password, aby ukryć wpisywane hasło
                            name="new_password" //nazwa wejścia
                            value={formData.new_password} // wyświetlana wartość
                            //aktualizacja pola wejściowego o aktualne informacje w nim zawarte
                            onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                        />

                    </div>

                    {/*kontener z guzikiem zapisującym zmiany*/}
                    <div className="editAccount">
                        {/*guzik zapisujący zmiany*/}
                        <button type="submit"><h3>Zapisz zmiany</h3></button>
                        {/*link do konta po naciśnięciu przycisku "anuluj"*/}
                        <Link to="/konto">
                            {/*przycisk "anuluj"*/}
                            <button type="button"><h3>Anuluj</h3></button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditAccount;