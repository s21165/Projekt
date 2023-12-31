import {useState} from "react";
import {GetBorderStyle} from "./products/GetBorderStyle";

export function NotificationsList({ data, small = false, onProductClick, left = false}) {

    const [expandedProduct, setExpandedProduct] = useState(null);
    const styl = GetBorderStyle(data,"current",4);
    // Funkcja do przełączania rozwinięcia produktu
    const handleToggleExpand = (productId) => {
        if (expandedProduct === productId) {
            setExpandedProduct(null);
        } else {
            setExpandedProduct(productId);
        }
    }

    return (
        <div className={`notificationsList ${small ? "small" : ""} ${left ? "left" : ""}`}>
            {data && data.map(product => (
                <div className={"notificationProductDiv"} key={product.id} style={{border:styl}}>

                    <div
                        className="notificationsNameDiv"
                        onClick={() => {
                            handleToggleExpand(product.id);
                            // Jeśli funkcja onProductClick została przekazana jako prop, wywołaj ją:
                            onProductClick && onProductClick(product);
                        }}
                    >
                        {product.nazwa}
                    </div>

                    <div className={`notificationsProductInfo ${expandedProduct === product.id ? "expanded" : ""}`}>
                        {expandedProduct === product.id && (
                            <>
                                <p>Data ważności: {new Date(product.data_waznosci).toISOString().split('T')[0]}</p>
                                <p>Ilość: {product.ilosc}</p>
                                <p>Cena: {product.cena}</p>
                                <p>Kalorie: {product.kalorie}</p>
                                <p>Tłuszcze: {product.tluszcze}</p>
                                <p>Węglowodany: {product.weglowodany}</p>
                                <p>Białko: {product.bialko}</p>
                                <p>Kategoria: {product.kategoria}</p>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}