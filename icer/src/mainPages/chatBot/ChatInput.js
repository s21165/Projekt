// ChatInput.js
import React, { useState } from 'react';
import './ChatInput.css';
import { Icon } from '@iconify/react';

function ChatInput({ onSendMessage }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if(inputValue !== '')
            onSendMessage(inputValue);

        setInputValue('');
    };

    return (
        <>
        <form  className="chat-input-container"  onSubmit={handleSubmit}>

            <input className="chatInput"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button className="chatInputButton" type="submit">Wyślij</button>
            
        </form>
        </>
    );
}

export default ChatInput;
