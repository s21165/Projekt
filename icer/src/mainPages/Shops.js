import {useEffect} from "react";
import axios from "axios";

export function Shops(){
    useEffect(() => {

            // Jeśli użytkownik jest zalogowany, wywołaj funkcję start_camera_monitoring_route
            axios.post('http://192.168.0.130:5000/start_camera_monitoring')
                .then((response) => {
                    console.log('Kamera rozpoczęła monitoring');
                })
                .catch((error) => {
                    console.error(`Wystąpił błąd podczas rozpoczynania monitoringu kamery: ${error}`);
                });

    }, []);
    return(
        <>
            <div>
                Shops
            </div>


        </>



    )


}