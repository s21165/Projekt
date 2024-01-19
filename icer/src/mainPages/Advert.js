import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {API_URL} from "../config";
import axios from "axios";
import './Advert.css';

export function Advert({setAdIsOn}) {
    const [videoFeedUrl, setVideoFeedUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideoFeed = () => {
            axios.post(`${API_URL}/start_camera_monitoring`)
                .then((response) => {
                    setAdIsOn=true;
                    setVideoFeedUrl(`${API_URL}/video_feed`);
                    console.log(response.data)
                })
                .catch((error) => {
                    console.error(`Error starting camera monitoring: ${error}`);
                });
        };

        const checkForEndSignal = () => {
            const img = document.createElement('img');
            img.src = videoFeedUrl;
            img.onload = () => {
                if (img.naturalWidth === 100 && img.naturalHeight === 100) {
                    clearInterval(intervalId);
                    setAdIsOn = false;
                    navigate('/')
                    console.log('xx')
                }
            };
        };

        fetchVideoFeed();
        const intervalId = setInterval(checkForEndSignal, 1000); // Check every second

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [videoFeedUrl, navigate]);

    return (
        <div className="advertContainer">
            {videoFeedUrl && <img className="advertImage" src={videoFeedUrl} alt="Video Feed" />}
        </div>
    );
}
