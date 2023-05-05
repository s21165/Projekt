import React, { useState } from 'react';

export default function EditAccount(props){
    const [firstName, setFirstName] = useState(props.firstName);
    const [lastName, setLastName] = useState(props.lastName);
    const [email, setEmail] = useState(props.email);
    const [phone, setPhone] = useState(props.phone);
    const [address, setAddress] = useState(props.address);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Wysłanie danych do API, aby zaktualizować informacje o użytkowniku
        // props.onSave({ firstName, lastName, email, phone, address });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                First Name:
                <input type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
            </label>
            <label>
                Last Name:
                <input type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} />
            </label>
            <label>
                Email:
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label>
                Phone:
                <input type="text" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </label>
            <label>
                Address:
                <input type="text" value={address} onChange={(event) => setAddress(event.target.value)} />
            </label>
            <button type="submit">Save</button>
        </form>
    );
}

