// MessageList.js
import React, {useState} from 'react';
import './MessageList.css';
function MessageList({ messages }) {


    return (
        <div  className="messagesContainer">

            {messages.map(message => (
                <div className="messageDiv" key={message.id}>{message.text}</div>
            ))}
        </div>
    );
}

export default MessageList;
