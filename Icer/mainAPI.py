from flask import Flask, request, jsonify, render_template, redirect, session

import value_manager
from database_connector import DatabaseConnector
from product_data import ProductData

app = Flask(__name__)
app.secret_key = 'secret_key'  # Klucz sesji

# Tworzenie instancji klasy DatabaseConnector
db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")

# Łączenie z bazą danych

db_connector.connect()


# Wyświetlanie lodówki
@app.route('/Icer', methods=['GET'])
def get_orders():
    db_connector.connect()

    # Przykładowe zapytanie do bazy danych
    query = "SELECT * FROM Icer"

    try:
        cursor = db_connector.get_connection().cursor()
        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()
        return jsonify(results)
    except Exception as error:
        return jsonify({"error": str(error)})


# Wyświetlanie zamówień
@app.route('/api/orders', methods=['GET', 'POST'])
def get_names():
    db_connector.connect()
    try:
        if request.method == 'GET':
            # Obsługa żądania GET
            query = "SELECT p.nazwa, i.ilosc FROM Icer i JOIN Produkty p ON i.produktID = p.id;"

            cursor = db_connector.get_connection().cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            cursor.close()

            order_list = []
            for row in results:
                order_list.append({"nazwa_produktu": row[0], "ilosc": row[1]})

            return jsonify(order_list)
        elif request.method == 'POST':
            # Obsługa żądania POST
            # Tu dodaj odpowiednią logikę dla żądania POST
            return jsonify({"message": "POST request received"})
    except Exception as error:
        return jsonify({"error": str(error)})


# Pobieranie danych produktów
@app.route('/api/products', methods=['GET'])
def get_products():
    db_connector.connect()
    # Tworzenie instancji klasy ProductData
    product_data = ProductData(db_connector.get_connection())

    products = product_data.fetch_products()
    return jsonify(products)


# Strona logowania
@app.route('/login', methods=['GET', 'POST'])
def login():
    db_connector.connect()
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Sprawdzanie, czy użytkownik istnieje w bazie danych
        if check_user(username, password):
            # Utworzenie sesji dla zalogowanego użytkownika
            session['username'] = username
            return redirect('/dashboard')
        else:
            error_message = 'Nieprawidłowe dane logowania. Spróbuj ponownie.'
            return render_template('login.html', error_message=error_message)
    else:
        return render_template('login.html')


# Strona wylogowania
@app.route('/logout')
def logout():
    # Usunięcie sesji
    session.pop('username', None)
    return redirect('/login')


# Strona główna po zalogowaniu
@app.route('/dashboard')
def dashboard():
    # Sprawdzenie, czy użytkownik jest zalogowany
    if 'username' in session:
        username = session['username']
        return render_template('dashboard.html', username=username)
    else:
        return redirect('/login')


# Funkcja sprawdzająca użytkownika w bazie danych
def check_user(username, password):
    # Przykładowe zapytanie do bazy danych
    query = "SELECT COUNT(*) FROM Users WHERE username = root AND password = root"
    values = (username, password)
    cursor = db_connector.get_connection().cursor()
    cursor.execute(query, values)
    result = cursor.fetchone()[0]
    cursor.close()

    if result == 1:
        return True
    else:
        return False


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
