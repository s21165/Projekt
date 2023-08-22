import './Fridge.css';
import {Icon} from "@iconify/react";
import {useState} from "react";
export function Fridge(){
    const [bulbIsOn, setbulbIsOn] = useState(false);

    function handleClick() {
        setbulbIsOn(!bulbIsOn);
    }
    return(
        <div className="fridgeContainer">
            <div className="fridge">

                SIEMA

            </div>
            <div onClick={handleClick} className={`light-bulb ${bulbIsOn ? 'on' : 'off'}`}>
                <Icon className="bulb" icon="mdi:lightbulb-on-outline" />
                <div className="light">
                </div>

            </div>

        </div>


    );
}
