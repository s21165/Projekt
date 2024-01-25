import {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { API_URL } from "../../settings/config";
import {AuthContext} from "../../account/auth-context";

// Custom hook
export const DecodeQrCode = () => {


    useEffect(() => {
        axios.post(`${API_URL}/decode_qr_code`)
            .then((response) => {

            })
            .catch((error) => {
                console.error(`Error in QRScan: ${error}`);
            });
    }, []);


};

