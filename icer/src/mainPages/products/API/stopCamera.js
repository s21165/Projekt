import axios from "axios";
import {API_URL} from "../../settings/config";
import {toast} from "react-toastify";

export const stopCamera = ({updateFood},productBackpack,setStreamCamera,setProductBackpack) => {
    axios.post(`${API_URL}/stop_camera`)
        .then((response) => {
            setStreamCamera(null);
            console.log(response.data);
            updateFood(setProductBackpack, setStreamCamera)
            console.log(productBackpack)
            toast.success('Camera stopped!');

        })
        .catch((error) => {
            console.error(`Error stopping camera: ${error}`);
            setStreamCamera(null);
        });

};
