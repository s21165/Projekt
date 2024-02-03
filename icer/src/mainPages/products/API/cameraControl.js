import axios from "axios";
import {API_URL} from "../../settings/config";
import {toast} from "react-toastify";

export const cameraControl = (setStreamCamera) => {

    axios.post(`${API_URL}/start_camera`)
        .then((response) => {

            console.log(response.data);
            toast.success('Camera started!');
            setStreamCamera(`${API_URL}/stream_camera?timestamp=${Date.now()}`);
        })
        .catch((error) => {
            setStreamCamera(null);
            console.error(`Error starting camera: ${error}`);
        });
};
