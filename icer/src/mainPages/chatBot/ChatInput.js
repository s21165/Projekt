// ChatInput.js
import React, {useState} from 'react';
import './ChatInput.css';

/*funkcja przyjmująca wiadomość od użytkownika, przyjmuje funkcję wysyłania wiadomości*/
function ChatInput({ onSendMessage }) {

    //zmienna posiadająca wpisywaną wiadomość
    const [inputValue, setInputValue] = useState('');

    //po zatwierdzeniu
    const handleSubmit = (e) => {
        //nie odświeżaj strony
        e.preventDefault();
        //jeśli wprowadzona wartość nie jest pustym ciągiem znaków to:
        if(inputValue !== '')
            //wywołaj funkcję onSendMessage z napisaną wiadomością
            onSendMessage(inputValue);
        //zmień wiadomość na pusty ciąg znaków
        setInputValue('');
    };

    return (
        <>
            {/*przy zatwierdzeniu wykonaj funkcję handleSubmit*/}
        <form  className="chat-input-container"  onSubmit={handleSubmit}>
            {/*miejsce do wprowadzenia wiadomości*/}
            <input className="chatInput"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            {/*zatwierdź wiadomość*/}
            <button className="chatInputButton" type="submit">Wyślij</button>
            
        </form>
        </>
    );
}

export default ChatInput;
