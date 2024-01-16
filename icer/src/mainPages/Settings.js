import {useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "../config";
import './Settings.css'

export function Settings() {

    const [optionGroup1, setOptionGroup1] = useState(4);
    const [optionGroup2, setOptionGroup2] = useState('');
    const [optionGroup3, setOptionGroup3] = useState('');
    const group1Options = ['bardzo małe', 'małe', 'średnie', 'duże', 'bardzo duże'];
    const handleOptionClick = (optionValue, setter) => {
        setter(optionValue);
    }
    // Nazwy dla drugiej grupy opcji
    const group2Options = ['bardzo małe', 'małe', 'średnie', 'duże', 'bardzo duże'];
    const infoProducts = ['tak', 'nie'];
    return (
        <div className="settings-container">
            <div className="settingsDiv">
                <h1 className="settingsHeader">Ustawienia</h1>
                <div className="settings-section">
                    <h2 className="settings-sectionHeader">Wielkość towarów w lodówce</h2>
                    <div className="custom-radio-container">
                        {group1Options.map((label, i) => (
                            <div
                                key={i}
                                className={`custom-radio-button ${optionGroup1 === i  ? 'selected' : ''}`}
                                onClick={() => handleOptionClick(i ,setOptionGroup1)}
                            >
                                {label}
                            </div>

                        ))}
                    </div>
                </div>
                <div className="settings-section">
                    <h2 className="settings-sectionHeader">Wielkość towarów na stronie produktów</h2>
                    <div className="custom-radio-container">
                        {group2Options.map((label, i) => (
                            <div
                                key={i}
                                className={`custom-radio-button ${optionGroup2 === i  ? 'selected' : ''}`}
                                onClick={() => handleOptionClick(i ,setOptionGroup2)}
                            >
                                {label}
                            </div>

                        ))}
                    </div>
                </div>
                <div className="settings-section">
                    <h2 className="settings-sectionHeader">Informacje o produktach widoczne na stronie produktów</h2>
                    <div className="custom-radio-container">
                        {infoProducts.map((label, i) => (
                            <div
                                key={i}
                                className={`custom-radio-button ${optionGroup3 ===i  ? 'selected' : ''}`}
                                onClick={() => handleOptionClick(i ,setOptionGroup3)}
                            >
                                {label}
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
