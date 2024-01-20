import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import axios from "axios";
import './Advert.css';
import io from 'socket.io-client';

export function Advert() {
    const [videoFeedUrl, setVideoFeedUrl] = useState("");
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const [adIsOn, setAdIsOn] = useState(false);

    useEffect(() => {
        socketRef.current = io(API_URL);
        socketRef.current.on('update_status', (data) => {
            console.log('Received data:', data);
            // Handle the data here
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
                    setAdIsOn(true);
                    setVideoFeedUrl(`${API_URL}/video_feed`);
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(`Error starting camera monitoring: ${error}`);
                });
        };

        fetchVideoFeed();
    }, [setAdIsOn]);

    return (
        <div className="advertContainer">
            {videoFeedUrl && <img className="advertImage" src={videoFeedUrl} alt="Video Feed" />}
        </div>
    );
}
