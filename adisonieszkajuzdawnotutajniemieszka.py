import os
import threading
from flask import Flask, request, render_template, send_file, redirect, url_for, send_from_directory, make_response
from modules.bot_module.bot import get_bot_response
from modules.scan_module.gen import generate_qr_code, generate_barcode
from modules.scan_module.forms import BarcodeForm
from modules.scan_module.decoder import decode_barcode, decode_qr_code
from modules.advert_module.monitor import start_camera_monitoring
from modules.foodIdent_module.foodIdent import foodIdent
import sys


from flask import Flask, request, jsonify, session, redirect
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import bcrypt

from modules import value_manager
from node_modules.database_connector import DatabaseConnector
from modules.product_data import ProductData
from datetime import datetime, timedelta

from modules.value_manager import ProductManager



app.config['BARCODE_FOLDER'] = os.path.join(app.static_folder, 'barcodes')
app.config['QR_CODE_FOLDER'] = os.path.join(app.static_folder, 'qrcodes')  
app.config['SECRET_KEY'] = 'key'  # Replace with a strong secret key
#app.config['BARCODE_FOLDER'] = 'static/barcodes

app = Flask(__name__)
CORS(app)
app.secret_key = 'secret_key'  # Klucz sesji

# Ładuj zmienne środowiskowe z pliku .env
load_dotenv()

# Tworzenie instancji klasy DatabaseConnector
db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")

# Łączenie z bazą danych
db_connector.connect()

# Tworzenie instancji ProductManager
product_manager = ProductManager(db_connector)


@app.route('/api/add_product', methods=['POST'])



def add_product():
    # Tworzenie instancji klasy DatabaseConnector
    db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")

    # Łączenie z bazą danych
    db_connector.connect()

    # Tworzenie instancji ProductManager
    product_manager = ProductManager(db_connector)

    connection = None
    cursor = None

    try:
        # Opcjonalnie: Wersja testowa z domyślnym użytkownikiem
        TESTING = True
        if TESTING:
            session['username'] = 'root'

        # Sprawdzenie, czy użytkownik jest zalogowany
        if 'username' not in session:
            return jsonify({"error": "User not logged in"}), 401

        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)

        username = session['username']

        # Pobranie ID użytkownika na podstawie nazwy użytkownika
        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()

        if not user_result:
            return jsonify({"error": "User not found"}), 401

        data = request.json
        user_id = user_result['id']

        # Sprawdzenie, czy produkt już istnieje
        check_product_query = "SELECT id FROM Produkty WHERE nazwa = %s AND cena = %s"
        cursor.execute(check_product_query, (data['nazwa'], data['cena']))
        product_exists = cursor.fetchone()

        if product_exists:
            product_id = product_exists['id']
        else:
            product_id = product_manager.dodaj_produkt(
                data['nazwa'],
                data['cena'],
                data['kalorie'],
                data['tluszcze'],
                data['weglowodany'],
                data['bialko'],
                data['kategoria']
            )

            if product_id is None:
                return jsonify({"error": "Failed to add product to Produkty table."})

        # Dodawanie produktu do tabeli Icer
        icer_query = "INSERT INTO Icer (UserID, produktID, ilosc, data_waznosci) VALUES (%s, %s, %s, %s)"
        cursor.execute(icer_query, (user_id, product_id, data['ilosc'], data['data_waznosci']))

        connection.commit()

        return jsonify({"message": "Produkt został dodany!"})

    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route('/api/subtract_product', methods=['POST'])
def subtract_product():
    try:
        data = request.json
        id_produktu = data['id_produktu']
        ilosc_do_odejscia = data['ilosc_do_odejscia']

        # Użycie klasy ProductManager do odejmowania ilości produktu w bazie danych
        product_manager.odejmij_produkt(id_produktu, ilosc_do_odejscia)

        return jsonify({"message": "Ilość produktu została zaktualizowana!"})

    except Exception as error:
        return jsonify({"error": str(error)})


@app.route('/api/edit_product/<int:product_id>', methods=['PUT'])
def edit_product(product_id):
    try:
        # Pobieranie danych produktu z żądania
        data = request.json

        # Aktualizacja produktu w bazie danych
        db_connector.update_product(product_id, data)

        return jsonify({"message": "Produkt został zaktualizowany!"})

    except Exception as error:
        return jsonify({"error": str(error)})


@app.route('/api/Icer', methods=['GET'])
def get_icer():
    connection = db_connector.get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        if 'username' not in session:
            return jsonify({"error": "User not logged in"}), 401

        # Pobranie ID aktualnie zalogowanego użytkownika
        username = session['username']
        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()

        if not user_result:
            return jsonify({"error": "User not found"}), 401

        # Modyfikacja zapytania SQL, aby pokazywać wszystkie informacje o produkcie
        user_id = user_result['id']
        query = """
            SELECT Icer.id, Icer.UserID, Icer.produktID, Icer.ilosc, 
                   Icer.data_waznosci, Icer.trzecia_wartosc,
                   Produkty.nazwa, Produkty.cena, Produkty.kalorie,
                   Produkty.tluszcze, Produkty.weglowodany, Produkty.bialko,
                   Produkty.kategoria
            FROM Icer
            INNER JOIN Produkty ON Icer.produktID = Produkty.id
            WHERE Icer.UserID = %s
        """
        cursor.execute(query, (user_id,))
        results = cursor.fetchall()

        return jsonify(results)

    except Exception as error:
        return jsonify({"error": str(error)})

    finally:
        cursor.close()


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


## funkcje wykorzystywane do rejestracji
def user_exists(username):
    query = "SELECT * FROM Users WHERE username = %s"
    values = (username,)
    cursor = db_connector.get_connection().cursor()
    cursor.execute(query, values)
    result = cursor.fetchone()
    cursor.close()

    return True if result else False


def save_user(username, hashed_pw):
    try:
        query = "INSERT INTO Users (username, password) VALUES (%s, %s)"
        values = (username, hashed_pw.decode('utf-8'))
        cursor = db_connector.get_connection().cursor()
        cursor.execute(query, values)
        db_connector.get_connection().commit()
        return True
    except Exception as error:
        print("Error during registration:", error)
        return False
    finally:
        cursor.close()


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']

    # Sprawdzenie, czy użytkownik już istnieje
    if user_exists(username):
        return jsonify({"message": "User already exists"}), 400

    # Szyfrowanie hasła
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Zapisanie użytkownika w bazie danych
    if save_user(username, hashed_pw):
        return jsonify({"message": "Registration successful"})
    else:
        return jsonify({"message": "Registration failed"}), 500


def check_user(username, password):
    try:
        query = "SELECT password FROM Users WHERE username = %s"
        values = (username,)
        cursor = db_connector.get_connection().cursor()
        cursor.execute(query, values)
        result = cursor.fetchone()

        if result:
            db_password = result[0].encode('utf-8')
            if bcrypt.checkpw(password.encode('utf-8'), db_password):
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
    print("test")
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


@app.route('/', methods=['GET', 'POST'])
def index():
    bot_response = ""
    barcode_form = BarcodeForm()  # For barcode form
    if request.method == 'POST':
        user_input = request.form['user_input']
        bot_response = get_bot_response(user_input)
    response = make_response(render_template('index.html', bot_response=bot_response, form=barcode_form))
    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    return response


from flask import jsonify

@app.route('/get_response', methods=['POST'])
def get_response():
    user_input = request.json.get('user_input')
    if user_input:
        response = get_bot_response(user_input)
        response_data = {'response': response}
        return jsonify(response_data), 200, {'Content-Type': 'application/json; charset=utf-8'}

    return jsonify({'error': 'Invalid input'})


@app.route('/generate_qr_code', methods=['POST'])
def generate_qr_code_route():
    data = {
        "name": request.form['name'],
        "price": request.form['price'],
        "kcal": request.form['kcal'],
        "fat": request.form['fat'],
        "carbs": request.form['carbs'],
        "protein": request.form['protein'],
        "category": request.form['category'],
        "amount": request.form['amount']
    }
    
    qr_code_image_filename = generate_qr_code(data, app.config['QR_CODE_FOLDER'])
    qr_code_image_path = os.path.join(app.config['QR_CODE_FOLDER'], qr_code_image_filename)
    return send_file(qr_code_image_path, mimetype='image/png')

@app.route('/generate_barcode', methods=['POST'])
def generate_barcode_route():
    if request.method == 'POST':
        data = {
            "name": request.form['name'],
            "price": request.form['price'],
            "kcal": request.form['kcal'],
            "fat": request.form['fat'],
            "carbs": request.form['carbs'],
            "protein": request.form['protein'],
            "category": request.form['category'],
            "amount": request.form['amount']
        }
        barcode_image_filename = generate_barcode(data, app.config['BARCODE_FOLDER'])
        barcode_image_path = os.path.join(app.config['BARCODE_FOLDER'], barcode_image_filename)
        return send_file(barcode_image_path, mimetype='image/png', as_attachment=True)

@app.route('/decode_barcode', methods=['POST'])
def decode_barcode_route():
    if 'barcode_image' not in request.files:
        return "No barcode image uploaded"
    
    barcode_image = request.files['barcode_image']
    if barcode_image.filename == '':
        return "No selected file"
    
    barcode_image_path = os.path.join(app.config['BARCODE_FOLDER'], barcode_image.filename)
    barcode_image.save(barcode_image_path)
    
    decoded_data = decode_barcode(barcode_image_path)
    
    return f"Decoded Barcode Data: {decoded_data}"

@app.route('/decode_qr_code', methods=['POST'])
def decode_qr_code_route():
    if 'qr_code_image' not in request.files:
        return "No QR code image uploaded"
    
    qr_code_image = request.files['qr_code_image']
    if qr_code_image.filename == '':
        return "No selected file"
    
    qr_code_image_path = os.path.join(app.config['QR_CODE_FOLDER'], qr_code_image.filename)
    qr_code_image.save(qr_code_image_path)
    
    decoded_data = decode_qr_code(qr_code_image_path)
    return f"Decoded QR Code Data: {decoded_data}"
    


@app.route('/start_camera_monitoring', methods=['POST'])
def start_camera_monitoring_route():
    camera_thread = threading.Thread(target=start_camera_monitoring)
    camera_thread.start()
    return redirect(url_for('index'))
    
    

@app.route('/start_food_identification', methods=['POST'])
def start_food_identification_route():
    camera_thread = threading.Thread(target=foodIdent)
    camera_thread.start()
    return redirect(url_for('index'))



if __name__ == '__main__':
    app.run(debug=True)