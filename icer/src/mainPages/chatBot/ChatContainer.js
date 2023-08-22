// ChatContainer.js
import React, {useState} from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import Main from "../../Main";
import Help from "../Help";
import { Icon } from '@iconify/react';
import axios from "axios";
function ChatContainer() {
    const [messages, setMessages] = useState([]);
    const [isMinimized, setIsMinimized] = useState(false);


    const handleBotResponse = async (userMessage) => {
        try {
            const response = await axios.post('http://localhost:5000/bot', new URLSearchParams({
                user_input: userMessage
            }));
            const botResponse = response.data;
            setMessages(prevMessages => [...prevMessages, { text: botResponse, id: Date.now(), sender: 'bot' }]);
        } catch (error) {
            console.error("There was an error:", error);
        }
    };

    const handleSendMessage = (message) => {
        setMessages([...messages, {text: message, id: Date.now(), sender: 'user'}]);
        handleBotResponse(message);
    };



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

    return (
        <div className="chat-container">
            <button className="minimize-button" onClick={() => setIsMinimized(true)}><Icon className="minimizeIcon" icon="solar:minimize-square-3-outline" rotate={1} /></button>
            <MessageList messages={messages}/>
            <ChatInput onSendMessage={handleSendMessage}/>

        </div>
    );
}

export default ChatContainer;