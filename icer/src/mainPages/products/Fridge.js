
import './Fridge.css';
import {Icon} from "@iconify/react";
import {useEffect, useState} from "react";
import {Notifications} from "../Notifications";
import {useLocation} from "react-router-dom";
import '../Notifications.css'
export function Fridge(){
    const [bulbIsOn, setbulbIsOn] = useState(true);
    const location = useLocation();
    function handleClick() {
        setbulbIsOn(!bulbIsOn);

    }

    return(
        <div className="fridgeContainer">
            <div className="fridge">

                SIEMA

                <div onClick={handleClick} className={`light-bulb ${bulbIsOn ? 'on' : 'off'}`}>
                    <Icon className="bulb" icon="mdi:lightbulb-on-outline" />
                    <div className="light">
                    </div>

                </div>

                {!bulbIsOn && <Notifications small/>}
                <div/>


            </div>

        </div>
    );
}
