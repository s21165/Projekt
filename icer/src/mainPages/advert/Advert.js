import {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {API_URL} from "../settings/config";
import axios from "axios";
import './Advert.css';
import io from 'socket.io-client';

//funkcja podstrony z reklamą
export function Advert({adIsOn, setAdIsOn}) {
    //zmienna przetrzymująca reklamę
    const [videoFeedUrl, setVideoFeedUrl] = useState(null);
    //zmienna przetrzymująca referencję do połączenia ze statusem reklamy
    const socketRef = useRef(null);
    //zmienna określająca czy reklama się zakończyła
    const [finishWord, setFinishWord] = useState("");


    useEffect(() => {
        //łączymy się z api
        socketRef.current = io(API_URL);

        // pobieramy informację przekazywane pod postacią 'update_status'
        socketRef.current.on('update_status', (data) => {
            //z informacji zapisujemy zmienną 'data' w  finishWord
            setFinishWord(data.data);
        });
        // zakańczamy połączenie jeśli takie istnieje
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        //pobierz wideo
        const fetchVideoFeed = () => {
            axios.post(`${API_URL}/start_camera_monitoring`, {}, {
                //ustawiamy nagłówek aby api wiedziało jakiego typu dane przesyłamy
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                //kiedy uda się połączyć
                .then((response) => {
                    //przypisujemy wideo do zmiennej - pobierane z api
                    setVideoFeedUrl(`${API_URL}/video_feed`);

                })
                //kiedy połączenie się nie uda
                .catch((error) => {
                    //wyświetl error w konsoli
                    console.error(`Error starting camera monitoring: ${error}`);
                });
        };
        //jeśli przesłane zostało słowo 'finished' to znaczy, że wideo zostało zakończone
        if (finishWord === 'finished') {
            //ustawiamy reklamę na 'false'
            setAdIsOn(false);
            setVideoFeedUrl(null);
        } else { //w przeciwnym razie dalej pobieraj wideo
            fetchVideoFeed();
        }
        fetchVideoFeed();

    }, [finishWord,adIsOn]); // odświeżaj po zmianie tych wartości


    return (
        <div className="advertContainer">
            {/* zwraca wideo, jeśli istnieje wartość videoFeedUrl */}
            {videoFeedUrl && <img className="advertImage" src={videoFeedUrl} alt="Video Feed"/>}
        </div>
    );
}
