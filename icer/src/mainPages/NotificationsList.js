import {useState} from "react";

export function NotificationsList({ data, small = false, onProductClick }) {

    const [expandedProduct, setExpandedProduct] = useState(null);

    // Funkcja do przełączania rozwinięcia produktu
    const handleToggleExpand = (productId) => {
        if (expandedProduct === productId) {
            setExpandedProduct(null);
        } else {
            setExpandedProduct(productId);
        }
    }

    return (
        <div className={`notificationsList ${small ? "small" : ""}`}>
            {data && data.map(product => (
                <div className={"notificationProductDiv"} key={product[0]}>

                    <div
                        className="notificationsNameDiv"
                        onClick={() => {
                            handleToggleExpand(product[0]);
                            // Jeśli funkcja onProductClick została przekazana jako prop, wywołaj ją:
                            onProductClick && onProductClick(product);
                        }}
                    >
                        {product[1]}
                    </div>

                    <div className={`notificationsProductInfo ${expandedProduct === product[0] ? "expanded" : ""}`}>
                        {expandedProduct === product[0] && (
                            <>
                                <p>Data ważności: {new Date(product[9]).toISOString().split('T')[0]}</p>
                                <p>Ilość: {product[8]}</p>
                                <p>Cena: {product[2]}</p>
                                <p>Kalorie: {product[3]}</p>
                                <p>Tłuszcze: {product[4]}</p>
                                <p>Węglowodany: {product[5]}</p>
                                <p>Białko: {product[6]}</p>
                                <p>Kategoria: {product[7]}</p>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}