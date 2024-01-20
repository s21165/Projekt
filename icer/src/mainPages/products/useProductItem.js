import {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../account/auth-context";
import axios from "axios";
import {API_URL} from "../../config";

export const useProductItem = (data, handleDecrease, handleIncrease,setIsSelected,handleZero) => {
    const [showRemovalConfirmation, setShowRemovalConfirmation] = useState(false);
    const [info, setInfo] = useState(false);

    const handleDecreaseWithCheck = (event) => {
        event.stopPropagation();
        if (data.ilosc === 1) {
            setShowRemovalConfirmation(true);
        } else {
            handleDecrease(data.id);
        }
    };

    const handleIncreaseItem = (event) => {
        event.stopPropagation();
        handleIncrease(data.id);
    };

    const handleRemoveItem = (event) =>{
        event.stopPropagation();
        handleZero(data.id);
    }
    const confirmRemoval = (event) => {
        event.stopPropagation();
        handleDecrease(data.id);
        setShowRemovalConfirmation(false);
        setIsSelected(null)

    };

    const declineRemoval = (event) => {
        event.stopPropagation();
        setShowRemovalConfirmation(false);
    };

    return {
        showRemovalConfirmation,
        setShowRemovalConfirmation,
        info,
        setInfo,
        handleDecreaseWithCheck,
        handleRemoveItem,
        handleIncreaseItem,
        confirmRemoval,
        declineRemoval
    };
};
