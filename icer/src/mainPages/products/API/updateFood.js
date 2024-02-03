import axios from "axios";
import {API_URL} from "../../settings/config";
import {toast} from "react-toastify";

export const updateFood = (setProductBackpack, setStreamCamera) => {
    axios.get(`${API_URL}/api/update_food_list`)
        .then((response) => {
            console.log(response.data);
            toast.success('update food!');
            setProductBackpack(response.data);
        })
        .catch((error) => {
            setStreamCamera(null);
            console.error(`Error starting camera: ${error}`);
        });
};