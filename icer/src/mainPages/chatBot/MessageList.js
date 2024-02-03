// MessageList.js
import React, {useEffect, useRef} from 'react';
import './MessageList.css';

//funkcja listy wiadomości przyjmująca zmienną z historią konwersacji
function MessageList({messages}) {

    //referencja do końca kontenera
    const messagesEndRef = useRef(null);

    //zjechanie do dołu kontenera kiedy jakakolwiek wiadomość zostanie wysłana
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            {/*kontener z wiadomościami*/}
            <div className="messagesContainer">
                {/*mapowanie w celu wyświetlenia wiadomości*/}
                {messages.map(message => (
                    //w zależności od twórcy wiadomości zmiana klasy kontenera
                    <div  className={message.sender === 'user' ? "userMessageDiv" : "botMessageDiv"} key={message.id}>{message.text}</div>
                ))}
                {/*referencja końca kontenera z wiadomościami*/}
                <div ref={messagesEndRef} />
            </div>

        </>
    );
}

export default MessageList;
