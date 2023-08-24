import React from "react";
import {Icon} from "@iconify/react";
import "./AddProduct.css"
export function ScanBr(){

    return(
        <div className="barcodeDiv">
            <button type="button" className="barCodeButton"><Icon className="barcodeIcon" icon="material-symbols:barcode" /></button>

        </div>
    );
}
