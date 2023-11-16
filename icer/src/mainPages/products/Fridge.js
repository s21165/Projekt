
import './Fridge.css';
import {Icon} from "@iconify/react";
import {useEffect, useState} from "react";
import {Notifications} from "../Notifications";
import {useLocation} from "react-router-dom";
import '../Notifications.css'

import image1 from  '../../data/image1.png'
import image2 from  '../../data/image2.png'
import image3 from  '../../data/image3.png'
import image4 from  '../../data/image4.png'
import image5 from  '../../data/image5.png'
import image6 from  '../../data/image6.png'
import image7 from  '../../data/image7.png'
import image8 from  '../../data/image8.png'
import image9 from  '../../data/image9.png'
import image10 from  '../../data/image10.png'

export function Fridge(){
    const [bulbIsOn, setbulbIsOn] = useState(true);
    const location = useLocation();
    function handleClick() {
        setbulbIsOn(!bulbIsOn);

    }
    // const imagePaths = [
    //     image1,
    //     image2,
    //     image3,
    //     image4,
    //     image5,
    //     image6,
    //     image7,
    //     image8,
    //     image9,
    //     image10,
    //     image1,
    //     image2,
    //     image3,
    //     image4,
    //     image5,
    //     image6,
    //     image7,
    //     image8,
    //     image9,
    //     image10,
    //     image5,
    //     image3,
    //     image7,
    //     image6,
    //     image8,
    //     image4,
    //     image10,
    //     image2,
    //     image9,
    //     image1,
    //     image7,
    //     image6,
    //     image8,
    //     image9,
    //     image10,
    //     image1,
    //
    // ];

    return(
        <div className="fridgeContainer">
            <div className="fridge">

                {/*{imagePaths.map((path, index) => (*/}
                {/*    <ProductPicture key={index} imagePath={path}  />*/}
                {/*))}*/}


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
