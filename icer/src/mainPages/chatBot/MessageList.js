// MessageList.js
import React, {useEffect, useRef, useState} from 'react';
import './MessageList.css';
import axios from "axios";

function MessageList({messages}) {
    const backendUrl = 'http://localhost:5000';
    const [answer,setAnswer] = useState('');
    const lastMessage = messages[messages.length - 1];


    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            <div className="messagesContainer">

                {messages.map(message => (
                    <div  className={message.sender === 'user' ? "userMessageDiv" : "botMessageDiv"} key={message.id}>{message.text}</div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            {/*<div className="botResponse">*/}
            {/*    {answer}*/}
            {/*</div>*/}
        </>
    );
}

export default MessageList;
