from flask import Flask, jsonify, request
from database_connector import DatabaseConnector
from product_data import ProductData
from value_manager import ProductManager

app = Flask(__name__)

# Tworzenie instancji klasy DatabaseConnector
db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")

# Łączenie z bazą danych
db_connector.connect()

# Pobieranie połączenia z bazą danych
connection = db_connector.get_connection()

# Tworzenie instancji klasy ProductData
product_data = ProductData(connection)

# Tworzenie instancji klasy ProductManager
product_manager = ProductManager(db_connector)


@app.route('/products', methods=['GET'])
def get_products():
    # Pobieranie danych produktów
    products = product_data.fetch_products()
    return jsonify(products)


@app.route('/products', methods=['POST'])
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
    product_manager.dodaj_produkt(nazwa, cena, kalorie, tluszcze, weglowodany, bialko, kategoria, ilosc)
    return jsonify({'message': 'Produkt został dodany do bazy danych.'})


@app.route('/products/<product_name>', methods=['PUT'])
def subtract_product(product_name):
    data = request.get_json()
    ilosc_do_odejscia = data['ilosc_do_odejscia']
    product_manager.odejmij_produkt(product_name, ilosc_do_odejscia)
    return jsonify({'message': 'Ilość produktu została zaktualizowana.'})


# Rozłączanie z bazą danych
@app.teardown_appcontext
def teardown_db(exception=None):
    db_connector.disconnect()


if __name__ == '__main__':
    app.run()
