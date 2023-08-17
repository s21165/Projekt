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

@app.route('/api/add_product', methods=['POST'])
def add_product():
    try:
        # Pobieranie danych produktu z żądania
        data = request.json

        nazwa = data['nazwa']
        cena = data['cena']
        bialko = data['bialko']
        tluszcze = data['tluszcze']
        weglowodany = data['weglowodany']
        blonnik = data['blonnik']
        kategoria = data['kategoria']
        ilosc = data['ilosc']



        return jsonify({"message": "Produkt został dodany!"})

    except Exception as error:
        return jsonify({"error": str(error)})


# # Dodawanie produktu do bazy danych za pomocą metody 'dodaj_produkt'        product_manager.dodaj_produkt(nazwa, cena, bialko, tluszcze, weglowodany, blonnik, kategoria, ilosc)

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



@app.route('/api/edit_user', methods=['POST'])
def edit_user():
    # Sprawdzanie, czy użytkownik jest zalogowany
    if 'username' not in session:
        return jsonify({"error": "Musisz być zalogowany, aby edytować dane."})

    try:
        data = request.json
        new_password = data.get('new_password')
        new_username = data.get('new_username')

        cursor = db_connector.get_connection().cursor()

        # Jeśli użytkownik dostarczył nowe hasło, aktualizuj hasło
        if new_password:
            query = "UPDATE Users SET password = %s WHERE username = %s"
            values = (new_password, session['username'])
            cursor.execute(query, values)

        # Jeśli użytkownik dostarczył nową nazwę użytkownika, aktualizuj nazwę użytkownika
        if new_username:
            # Najpierw sprawdź, czy nowa nazwa użytkownika jest unikatowa
            check_query = "SELECT * FROM Users WHERE username = %s"
            cursor.execute(check_query, (new_username,))
            if cursor.fetchone():
                return jsonify({"error": "Nazwa użytkownika jest już zajęta."})

            query = "UPDATE Users SET username = %s WHERE username = %s"
            values = (new_username, session['username'])
            cursor.execute(query, values)

            # Aktualizacja nazwy użytkownika w sesji
            session['username'] = new_username

        db_connector.get_connection().commit()
        cursor.close()

        return jsonify({"message": "Dane zostały zaktualizowane!"})

    except Exception as error:
        return jsonify({"error": str(error)})


# Strona wylogowania
@app.route('/logout')
def logout():
    # Usunięcie sesji
    session.pop('username', None)
    return redirect('/login')

if __name__ == '__main__':
    app.run()
