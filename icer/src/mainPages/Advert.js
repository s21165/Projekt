import {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {API_URL} from "../config";
import axios from "axios";
import './Advert.css';
import io from 'socket.io-client';

export function Advert({adIsOn, setAdIsOn}) {
    const [videoFeedUrl, setVideoFeedUrl] = useState("");
    const socketRef = useRef(null);
    const [finishWord, setFinishWord] = useState("");

    useEffect(() => {
        socketRef.current = io(API_URL);
        socketRef.current.on('update_status', (data) => {
            setFinishWord(data.data);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const fetchVideoFeed = () => {
            axios.post(`${API_URL}/start_camera_monitoring`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    console.error(`adisOn: ${adIsOn}`);
                    setVideoFeedUrl(`${API_URL}/video_feed`);
                    console.log('dostalem data:', finishWord);
                })
                .catch((error) => {
                    console.error(`Error starting camera monitoring: ${error}`);
                });
        };
        if (finishWord === 'finished') {
            setAdIsOn(false); // Turn off the advertisement



        } else {
            fetchVideoFeed();
        }
        fetchVideoFeed();
    }, [finishWord,adIsOn]);

    return (
        <div className="advertContainer">
            {videoFeedUrl && <img className="advertImage" src={videoFeedUrl} alt="Video Feed"/>}
        </div>
    );
}
