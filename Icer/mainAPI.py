from flask import Flask, request, jsonify
from database_connector import DatabaseConnector
from product_data import ProductData

app = Flask(__name__)

# Tworzenie instancji klasy DatabaseConnector
db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")

# Łączenie z bazą danych
db_connector.connect()

# Tworzenie instancji klasy ProductData
product_data = ProductData(db_connector.get_connection())

# Pobieranie danych produktów
@app.route('/api/products', methods=['GET'])
def get_products():
    products = product_data.fetch_products()
    return jsonify(products)

# Dodawanie produktu
@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.get_json()
    nazwa = data['nazwa']
    cena = data['cena']
    kalorie = data['kalorie']
    tluszcze = data['tluszcze']
    weglowodany = data['weglowodany']
    bialko = data['bialko']
    kategoria = data['kategoria']
    ilosc = data['ilosc']

    product_manager = value_manager.ProductManager(db_connector)
    product_manager.dodaj_produkt(nazwa, cena, kalorie, tluszcze, weglowodany, bialko, kategoria, ilosc)

    return jsonify({"message": "Produkt został dodany do bazy danych."})

# Odejmowanie produktu
@app.route('/api/products/<string:nazwa>', methods=['PUT'])
def remove_product(nazwa):
    data = request.get_json()
    ilosc_do_odejscia = data['ilosc']

    product_manager = value_manager.ProductManager(db_connector)
    product_manager.odejmij_produkt(nazwa, ilosc_do_odejscia)

    return jsonify({"message": "Ilość produktu została zaktualizowana."})

# Rozłączanie z bazą danych
@app.teardown_appcontext
def teardown_db(exception):
    db_connector.disconnect()

if __name__ == '__main__':
    app.run()
