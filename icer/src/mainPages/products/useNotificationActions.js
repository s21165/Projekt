import axios from 'axios';
import { API_URL } from "../../config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const useNotificationActions = (data,setData,sessionId,refresh,setRefresh) => {





    const handleRemoveAllNotifications = () => {

        axios
            .post(`${API_URL}/api/Icer/delete_all_notification`,{
                sessionId: sessionId

            },)
            .then((response) => {
                toast.success(`Wszystkie powiadomienia zostały usunięte!`);
                setRefresh(!refresh); // Refresh the product list after deletion

            })
            .catch((error) => {
                console.error(`There was an error removing all notifications: ${error}`);
                toast.error(`Nie udało się usunąć wszystkich powiadomień!`)
            });
    };

    const handleRemoveNotification = (productId) => {

        axios
            .post(`${API_URL}/api/Icer/delete_notification`,{
                sessionId: sessionId,
                notificationId:productId,
                notificationValue:null
            },)
            .then((response) => {
                console.log(response.data);
                toast.success(`Powiadomienie zostało usunięte!`);
                setRefresh(!refresh); // Refresh the product list after deletion

            })
            .catch((error) => {
                console.error(`There was an error removing the product: ${error}`);
                toast.error(`Nie udało się usunąć powiadomienia!`)
            });
    };


    return { handleRemoveAllNotifications, handleRemoveNotification };
};
