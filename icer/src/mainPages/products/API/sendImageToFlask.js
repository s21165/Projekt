import axios from "axios";
import {API_URL} from "../../settings/config";

export const sendImageToFlask = async (file,setImageForIdentyficationURL) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_URL}/upload_image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        setImageForIdentyficationURL(null)
        console.log(response.data);
        if (response.data.prediction) {
            console.log(response.data.prediction);
        }

    } catch (error) {
        console.error('Error:', error);
    }
};
