import React, {useState} from 'react';
import './LoginForm.css';

function RegisterForm({onRegister, onSwitchToLogin}) {

    //inicjalizacja zmiennych przetrzymujących nazwę oraz hasło
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // złożenie formularza wywołuje funkcję rejestracji oraz zmianę podstrony na ekran logowania
    const handleSubmit = event => {
        event.preventDefault();

        onRegister({username, password});
        onSwitchToLogin();

    };

    //formularz rejestracji
    return (
        //te same style formularza co w loginForm, kontener posiadający cały formularz
        <form onSubmit={handleSubmit} className="loginFormAll">
            {/*wewnętrzny kontener formularza*/}
            <div className="loginFormBox">

                {/*pobieramy dane wejściowe od użytkownika odnośnie nazwy*/}
                <input className="username"
                       type="text"
                       value={username}
                       onChange={e => setUsername(e.target.value)}
                       placeholder="Username"
                />

                {/*pobieramy dane wejściowe od użytkownika odnośnie hasła*/}
                <input className="password"
                       type="password"
                       value={password}
                       onChange={e => setPassword(e.target.value)}
                       placeholder="Password"
                />

                {/*przycisk zatwierdzający informacje, zarejestruj*/}
                <button type="submit" className="registerButton">Zarejestruj</button>

                {/*przycisk przenoszący do podstrony logowania*/}
                <button type="button" className="loginButton" onClick={onSwitchToLogin}>
                    Wróć do logowania
                </button>
            </div>
        </form>
    );
}

export default RegisterForm;
