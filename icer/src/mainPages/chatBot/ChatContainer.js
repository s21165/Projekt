// ChatContainer.js
import React, {useState} from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import Help from "../Help";
import {Icon} from '@iconify/react';
import axios from "axios";
import {API_URL} from "../settings/config";


//funkcja chatu z botem
function ChatContainer() {

    //zmienna posiadająca historię konwersacji
    const [messages, setMessages] = useState([]);

    //zmienna określająca czy chat został zminimalizowany
    const [isMinimized, setIsMinimized] = useState(false);

    //funkcja wysyłająca wiadomość od uzytkownika i pobierająca odpowiedź
    const handleBotResponse = async (userMessage) => {
        try {
            const response = await axios.post(`${API_URL}/get_response`, {
                user_input: userMessage

            });
            //zapisywanie odpowiedzi
            console.log(response.data)
            const botResponse = response.data.response;
            //dodawanie odpowiedzi do zmiennej posiadającej całą konwersację
            setMessages(prevMessages => [...prevMessages, { text: botResponse, id: Date.now(), sender: 'bot' }]);
        } catch (error) {
            //w ramach błędu z wykonaniem zapytania do api wyświetla komunikat w konsoli
            console.error("There was an error:", error);
        }
    };
    //funkcja wywołana podczas wysyłania wiadomości
    const handleSendMessage = (message) => {
        //dodanie wiadomości użytkownika do zmiennej posiadającej konwersację
        setMessages([...messages, {text: message, id: Date.now(), sender: 'user'}]);
        //wywołanie zmiennej posiadającej połączenie do api wraz z wiadomością do bota
        handleBotResponse(message);
    };


    //jeśli zminimalizowane zwróć ikonkę
    if (isMinimized) {
        return (
            <div className="chat-container">
                <div className="chat-icon-container">

                    <span role="img" aria-label="Chat Icon" onClick={() => setIsMinimized(false)}><Icon className="chatOpenIcon" icon="bi:chat-dots" hFlip={true} /></span>

                </div>
                <Help isMinimized={isMinimized}/>
            </div>
        );
    }
    //zwróć chat
    return (
        //kontener z chatem
        <div className="chat-container">
            {/*przycisk do minimalizowania i powiększania chatu*/}
            <button className="minimize-button" onClick={() => setIsMinimized(true)}><Icon className="minimizeIcon" icon="solar:minimize-square-3-outline" rotate={1} /></button>

            {/*funkcja posiadająca listę wiadomości, przekazujemy jej zmienną, która posiada konwerację*/}
            <MessageList messages={messages}/>

            {/*funkcja przyjmująca wiadomość od użytkownika, przyjmuje funkcję wysyłania wiadomości*/}
            <ChatInput onSendMessage={handleSendMessage}/>

        </div>
    );
}

export default ChatContainer;