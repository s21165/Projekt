import React from "react";
import {Icon} from "@iconify/react";
import "./AddProduct.css"
export function ScanQr(){

    return(
        <div className="qrDiv">
            <button type="button" ><Icon className="qrIcon" icon="bx:qr-scan" /></button>

        </div>
    );
}
