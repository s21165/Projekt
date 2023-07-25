from flask import Flask, request, jsonify, session, render_template, redirect
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import os

import value_manager
from database_connector import DatabaseConnector
from product_data import ProductData

app = Flask(__name__)
CORS(app)
app.secret_key = 'secret_key'  # Klucz sesji

# Ładuj zmienne środowiskowe z pliku .env
load_dotenv()

# Tworzenie instancji klasy DatabaseConnector
db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")

# Łączenie z bazą danych
db_connector.connect()

## tutaj jakie sa juz dzialace endpointy
print("http://127.0.0.1:5000/api/products")
print("http://127.0.0.1:5000/api/Icer")
print("http://127.0.0.1:5000/api/login")
# work in progress
print("http://127.0.0.1:5000/api/products/image")


# Wyświetlanie lodówki
@app.route('/api/Icer', methods=['GET'])
def get_icer():
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


# Wyświetlanie produktów z informacjami o obrazach produktów
@app.route('/api/products/image', methods=['GET', 'POST'])
def get_images():
    try:
        if request.method == 'GET':
            query = "SELECT nazwa FROM Produkty"

            cursor = db_connector.get_connection().cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            cursor.close()

            product_list = []
            for row in results:
                product_name = row[0]
                image_url = search_image(product_name)
                product_list.append({"nazwa_produktu": product_name, "obraz": image_url})

            return jsonify(product_list)
        elif request.method == 'POST':
            # Obsługa żądania POST
            # Tu dodaj odpowiednią logikę dla żądania POST
            return jsonify({"message": "POST request received"})
    except Exception as error:
        return jsonify({"error": str(error)})


# Funkcja wyszukująca obraz dla danej nazwy produktu
def search_image(product_name):
    # Użyj API Google Images lub innego dostępnego API do wyszukiwania obrazów na podstawie nazwy produktu
    # Tutaj umieść kod żądania do API i przetwarzanie odpowiedzi, aby uzyskać adres URL obrazu

    # Przykładowe zapytanie do API Google Images
    api_key = "YOUR_API_KEY"
    search_url = f"https://www.googleapis.com/customsearch/v1?key={api_key}&cx=YOUR_CX&q={product_name}&searchType=image"
    response = requests.get(search_url)
    results = response.json()

    if "items" in results:
        first_result = results["items"][0]
        image_url = first_result["link"]
        return image_url

    return ""  # Zwróć pusty ciąg, jeśli nie znaleziono obrazu


# Pobieranie danych produktów
@app.route('/api/products', methods=['GET'])
def get_products():
    # Tworzenie instancji klasy ProductData
    product_data = ProductData(db_connector.get_connection())
    products = product_data.fetch_products()
    return jsonify(products)


# Strona logowania
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        password = data['password']

        # Sprawdzanie, czy użytkownik istnieje w bazie danych
        if check_user(username, password):
            # Utworzenie sesji dla zalogowanego użytkownika
            session['username'] = username
            return jsonify({"message": "Login successful"})
        else:
            return jsonify({"message": "Invalid credentials"}), 401
    else:
        return jsonify({"message": "Method not allowed"}), 405


# Funkcja sprawdzająca użytkownika w bazie danych
def check_user(username, password):
    try:
        # Przykładowe zapytanie do bazy danych - UWAGA: To jest tylko przykład, NIEBEZPIECZNE dla produkcji!
        query = "SELECT password FROM Users WHERE username = %s"
        values = (username,)
        cursor = db_connector.get_connection().cursor()
        cursor.execute(query, values)
        result = cursor.fetchone()

        if result:
            db_password = result[0]
            if db_password == password:
                # Utworzenie sesji po poprawnym uwierzytelnieniu użytkownika
                session['username'] = username
                return True
        return False

    except Exception as error:
        print("Error during user authentication:", error)
        return False
    finally:
        cursor.close()

        return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect('/login')


# Strona główna po zalogowaniu
@app.route('/dashboard')
def dashboard():
    # Sprawdzenie, czy użytkownik jest zalogowany
    if 'username' in session:
        username = session['username']
        return render_template('dashboard.html', username=username)


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
# @app.teardown_appcontext
# def teardown_db(exception):
#    db_connector.disconnect()

if __name__ == '__main__':
    app.run()
