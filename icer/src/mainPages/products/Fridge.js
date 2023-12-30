
import './Fridge.css';
import {Icon} from "@iconify/react";
import {useEffect, useState} from "react";
import {Notifications} from "../Notifications";
import {useLocation} from "react-router-dom";
import '../Notifications.css'


export function Fridge(){
    const [bulbIsOn, setbulbIsOn] = useState(true);
    const [lowWidth, setLowWidth] = useState(window.innerWidth);
    const [lowHeight, setLowHeight] = useState(window.innerHeight);
    function handleClick() {
        setbulbIsOn(!bulbIsOn);

    }

    useEffect(() => {
        const handleResize = () => {
            setLowWidth(window.innerWidth);
            setLowHeight(window.innerHeight);

        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            bulbPosition(lowWidth, lowHeight)
        };

    }, [lowHeight, lowWidth]);

    const bulbPosition =( lowWidth, lowHeight) =>{
        console.log(lowWidth, lowHeight)
        return !(lowWidth < 1000 || lowHeight < 800);
    }

    return(
        <div className="fridgeContainer">
            <div className="fridge">

                {/*{imagePaths.map((path, index) => (*/}
                {/*    <ProductPicture key={index} imagePath={path}  />*/}
                {/*))}*/}


                <div onClick={handleClick} className={`light-bulb ${bulbIsOn ? 'on' : 'off'} ${bulbPosition(lowWidth, lowHeight) ? '' : 'left'}`}>

                    <Icon className="bulb" icon="mdi:lightbulb-on-outline" />
                    <div className="light">
                    </div>

                </div>

                {!bulbIsOn &&  bulbPosition(lowWidth, lowHeight) && <Notifications small left/>}
                { !bulbIsOn &&  !bulbPosition(lowWidth, lowHeight) && <Notifications small />}
                <div/>


            </div>

        </div>
    );
}
