import base64

import bcrypt
import os
import requests
from apscheduler.schedulers.background import BackgroundScheduler

from flask import Flask, redirect, current_app
from flask_cors import CORS
from modules.database_connector import DatabaseConnector
from modules.image_handler import handle_image_upload

from modules.product_data import ProductData
from modules.value_manager import ProductManager


import threading
from flask import Flask, request, render_template, send_file, redirect, url_for, send_from_directory, make_response
from flask import Flask, Response, request, render_template, redirect, url_for, make_response

from flask import Flask, request, render_template, url_for
from modules.foodIdent_module.foodIdent import load_and_prep_image, pred_and_plot, load_model
from modules.foodIdent_module.foodIdentVideo import start_camera, stop_camera
from modules.bot_module.bot import get_bot_response
from modules.scan_module.gen import generate_qr_code # ,generate_barcode
#from modules.scan_module.forms import BarcodeForm
from modules.scan_module.decoder import decode_qr_code # ,decode_barcode
from modules.advert_module.monitor import generate_frames

import sys

app = Flask(__name__)
CORS(app, supports_credentials=True)
# Otawian
app.config['BARCODE_FOLDER'] = os.path.join(app.static_folder, 'barcodes')
app.config['QR_CODE_FOLDER'] = os.path.join(app.static_folder, 'qrcodes')  
app.config['SECRET_KEY'] = 'key'  # Replace with a strong secret key
#app.config['BARCODE_FOLDER'] = 'static/barcodes

# Loading model
model = load_model('model3.h5')
print("Model loaded successfully:", model is not None)
###

app.secret_key = 'key'  # Klucz sesji

# Tworzenie instancji klasy DatabaseConnector
db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")

# Łączenie z bazą danych
db_connector.connect()

# Tworzenie instancji ProductManager
product_manager = ProductManager(db_connector)


def run_daily_procedure():
    local_connector = DatabaseConnector("localhost", "root", "root", "Sklep")
    local_connector.connect()
    cursor = local_connector.get_connection().cursor()
    cursor.callproc('UpdateTrzeciaWartosc')
    cursor.close()
    local_connector.get_connection().commit()


@app.route('/api/add_to_product', methods=['POST'])
def add_to_product():
    print("dochp?")
    # Tworzenie instancji klasy DatabaseConnector
    db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")

    # Łączenie z bazą danych
    db_connector.connect()

    # Tworzenie instancji ProductManager
    product_manager = ProductManager(db_connector)

    connection = None
    cursor = None

    try:
        # Upewnienie się co do sesji
        data = request.get_json()
        received_session_id = data.get('sessionId', None)
        if not received_session_id:
            raise ValueError("Session ID not provided")

        # Sprawdzenie, czy użytkownik jest zalogowany
        if 'username' not in session:
            raise PermissionError("User not logged in")

        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)

        username = session['username']

        # Pobranie ID użytkownika na podstawie nazwy użytkownika
        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()

        if not user_result:
            raise LookupError("User not found")

        user_id = user_result['id']

        # Pobieranie informacji o produkcie
        id_produktu = data['id_produktu']
        ilosc_do_dodania = data.get('ilosc_do_dodania', 1)  # Jeśli ilość nie zostanie podana, domyślnie dodaje 1

        # Użycie klasy ProductManager do dodawania ilości produktu w bazie danych
        product_manager.dodaj_jednostke_produktu(id_produktu, user_id)
        print("dodaje?")

        return jsonify({"message": "Ilość produktu została dodana!"})

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except PermissionError as pe:
        return jsonify({"error": str(pe)}), 401
    except LookupError as le:
        return jsonify({"error": str(le)}), 404
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route('/api/reset_product_quantity', methods=['POST'])
def reset_product_quantity():
    print("dochp?")

    # Tworzenie instancji klasy DatabaseConnector
    db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")

    # Łączenie z bazą danych
    db_connector.connect()

    # Tworzenie instancji ProductManager
    product_manager = ProductManager(db_connector)

    connection = None
    cursor = None

    try:
        # Upewnienie się co do sesji
        data = request.get_json()
        received_session_id = data.get('sessionId', None)
        if not received_session_id:
            raise ValueError("Session ID not provided")

        # Sprawdzenie, czy użytkownik jest zalogowany
        if 'username' not in session:
            raise PermissionError("User not logged in")

        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)

        username = session['username']

        # Pobranie ID użytkownika na podstawie nazwy użytkownika
        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()

        if not user_result:
            raise LookupError("User not found")

        user_id = user_result['id']

        # Pobieranie informacji o produkcie
        id_produktu = data['id_produktu']

        # Użycie klasy ProductManager do zerowania ilości produktu w bazie danych
        product_manager.zeruj_ilosc_produktu(id_produktu, user_id)
        print("zeruje?")

        return jsonify({"message": "Ilość produktu została zresetowana!"})

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except PermissionError as pe:
        return jsonify({"error": str(pe)}), 401
    except LookupError as le:
        return jsonify({"error": str(le)}), 404
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route('/api/subtract_product', methods=['POST'])
def subtract_product():
    db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")

    # Łączenie z bazą danych
    db_connector.connect()

    # Tworzenie instancji ProductManager
    product_manager = ProductManager(db_connector)

    connection = None
    cursor = None

    try:
        # Upewnienie się co do sesji
        data = request.get_json()
        received_session_id = data.get('sessionId', None)
        if not received_session_id:
            raise ValueError("Session ID not provided")

        # Sprawdzenie, czy użytkownik jest zalogowany
        if 'username' not in session:
            raise PermissionError("User not logged in")

        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)

        username = session['username']

        # Pobranie ID użytkownika na podstawie nazwy użytkownika
        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()

        if not user_result:
            raise LookupError("User not found")

        user_id = user_result['id']

        # Pobieranie informacji o produkcie
        id_produktu = data['id_produktu']

        # Użycie klasy ProductManager do odejmowania ilości produktu w bazie danych
        product_manager.odejmij_jednostke_produktu(id_produktu, user_id)

        return jsonify({"message": "Ilość produktu została zaktualizowana!"})

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except PermissionError as pe:
        return jsonify({"error": str(pe)}), 401
    except LookupError as le:
        return jsonify({"error": str(le)}), 404
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route('/remove_product_for_user', methods=['POST'])
def remove_product_for_user():
    db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")
    db_connector.connect()
    connection = None
    cursor = None

    try:
        # Sprawdzenie, czy użytkownik jest zalogowany
        if 'username' not in session:
            raise PermissionError("User not logged in")

        username = session['username']

        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)

        # Pobranie ID użytkownika na podstawie nazwy użytkownika
        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()

        if not user_result:
            raise LookupError("User not found")

        user_id = user_result['id']

        # Pobranie informacji o produkcie z żądania
        data = request.get_json()

        # Obsługa błędu dla braku klucza 'produktID' w żądaniu
        try:
            product_id = data['produktID']
        except KeyError:
            return jsonify({"error": "produktID is required"}), 400

        # Wydrukowanie zapytania do bazy danych
        query_to_execute = f"CALL ModifyProductQuantity({product_id}, {user_id}, 'remove');"
        print(query_to_execute)

        # Użycie klasy ProductManager do usunięcia produktu
        product_manager = ProductManager(db_connector)
        product_manager.usun_produkt(product_id, user_id)

        return jsonify({"message": "Produkt został usunięty pomyślnie!"})

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except PermissionError as pe:
        return jsonify({"error": str(pe)}), 401
    except LookupError as le:
        return jsonify({"error": str(le)}), 404
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        db_connector.disconnect()  # Zamknięcie połączenia z bazą danych


@app.route('/api/add_product', methods=['POST'])
def add_product():
    try:
        # Tworzenie instancji klasy DatabaseConnector
        db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")

        # Łączenie z bazą danych
        db_connector.connect()

        # Pobieranie danych z żądania
        data = request.json
        image_data = data.get('imageData')

        # Pobranie ID użytkownika na podstawie nazwy użytkownika
        user_id, error_response, status_code = get_user_id_by_username(session.get('username'), db_connector)

        if error_response:
            return error_response, status_code

        # Reszta kodu bez zmian, używając user_id

        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)

        # Sprawdzenie, czy produkt już istnieje
        check_product_query = "SELECT id FROM Produkty WHERE nazwa = %s AND cena = %s"
        cursor.execute(check_product_query, (data['nazwa'], data['cena']))
        product_exists = cursor.fetchone()

        if product_exists:
            product_id = product_exists['id']
        else:
            product_manager = ProductManager(db_connector)
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
                return jsonify({"error": "Failed to add product to Produkty table."}), 500

        # Dodanie daty dodania do tabeli 'Icer'
        add_icer_query = """
            INSERT INTO Icer (UserID, produktID, ilosc, data_waznosci, data_dodania)
            VALUES (%s, %s, %s, %s, NOW())
        """
        cursor.execute(add_icer_query, (user_id, product_id, data['ilosc'], data['data_waznosci']))

        # Wywołanie funkcji do obsługi przesyłania zdjęcia tylko jeśli dostępne są dane zdjęcia
        if image_data:
            handle_image_upload(db_connector, data['imageName'], image_data, user_id, product_id)

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": "Product added successfully!"})

    except Exception as error:
        return jsonify({"error": str(error)}), 500


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


@app.route('/api/shoppingList', methods=['POST', 'GET'])
def get_icer_shopping():
    # Tworzenie instancji klasy DatabaseConnector
    db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")

    # Łączenie z bazą danych
    db_connector.connect()

    try:

        # Uzyskanie połączenia z bazą danych
        connection = db_connector.get_connection()
        if not connection:
            raise ConnectionError("Failed to establish a connection with the database.")

        cursor = connection.cursor(dictionary=True)
        if not cursor:
            raise Exception("Failed to create a cursor for the database.")

        data = request.get_json()

        # Upewnienie się co do sesji
        received_session_id = data.get('sessionId', None)
        if not received_session_id:
            raise ValueError("Session ID not provided")

        # Jeśli użytkownik nie jest zalogowany
        if 'username' not in session:
            raise PermissionError("User not logged in")

        # Pobranie ID aktualnie zalogowanego użytkownika
        username = session['username']

        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()
        if not user_result:
            raise LookupError("User not found")

        # Modyfikacja zapytania SQL, aby pokazywać wszystkie informacje o produkcie
        user_id = user_result['id']
        query = """
            SELECT Icer.id, Icer.UserID, Icer.produktID, Icer.ilosc,
                   Produkty.nazwa, Produkty.cena, Produkty.kalorie,
                   Produkty.tluszcze, Produkty.weglowodany,
                   Produkty.bialko,Produkty.kategoria
            FROM Icer
            INNER JOIN Produkty ON Icer.produktID = Produkty.id
            LEFT JOIN Shopping ON Icer.produktID = Shopping.produktID
            WHERE Icer.UserID = %s AND (Icer.ilosc = 0 or Icer.trzecia_wartosc = 0 or Shopping.in_cart = 1)
        """
        cursor.execute(query, (user_id,))
        results = cursor.fetchall()

        return jsonify(results)

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except PermissionError as pe:
        return jsonify({"error": str(pe)}), 401
    except LookupError as le:
        return jsonify({"error": str(le)}), 404
    except ConnectionError as ce:
        return jsonify({"error": str(ce)}), 500
    except Exception as error:
        # Tutaj możemy logować błąd w bardziej szczegółowy sposób
        current_app.logger.error(f"Unexpected error: {error}")
        return jsonify({"error": "Unexpected server error"}), 500

    finally:
        if cursor:
            cursor.close()


# dla czystrzego kodu pozniej to bd zaimplementowane rowniez w innych funkcjach, na razie to jest jeszcze w fazie
# testowej
def get_user_id_by_username(username, db_connector):
    if 'username' not in session:
        return None, jsonify({"error": "User not logged in"}), 401

    connection = db_connector.get_connection()
    cursor = connection.cursor()

    try:
        # Pobranie ID użytkownika na podstawie nazwy użytkownika
        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()

        if user_result:
            return user_result['id'], None, None
        else:
            return None, jsonify({"error": "User not found"}), 401

    except Exception as error:
        print(f"Error: {str(error)}")
        return None, jsonify({"error": str(error)}), 500

    finally:
        cursor.close()
        connection.close()


@app.route('/api/add_to_shopping_cart', methods=['POST'])
def add_to_shopping_cart():
    try:
        # Pobranie danych z żądania
        data = request.json

        # Sprawdzenie, czy użytkownik jest zalogowany
        if 'username' not in session:
            return jsonify({"error": "User not logged in"}), 401

        # Pobranie ID użytkownika na podstawie nazwy użytkownika
        username = session['username']
        user_id = get_user_id_by_username(username)

        if user_id is None:
            return jsonify({"error": "User not found"}), 401

        # Pobranie ID produktu z żądania
        product_id = data.get('productID')

        if product_id is None:
            return jsonify({"error": "Product ID not provided"}), 400

        # Pobranie wartości in_cart z żądania (1 lub 0)
        in_cart_value = data.get('inCart')

        if in_cart_value not in [0, 1]:
            return jsonify({"error": "Invalid inCart value"}), 400

        # Uzyskanie połączenia z bazą danych
        db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")
        db_connector.connect()

        # Sprawdzenie, czy produkt już istnieje w koszyku
        check_product_query = "SELECT id FROM Shopping WHERE UserID = %s AND produktID = %s"
        with db_connector.get_connection().cursor() as cursor:
            cursor.execute(check_product_query, (user_id, product_id))
            existing_product = cursor.fetchone()

        if existing_product:
            # Aktualizacja wartości in_cart
            update_query = "UPDATE Shopping SET in_cart = %s WHERE UserID = %s AND produktID = %s"
            with db_connector.get_connection().cursor() as cursor:
                cursor.execute(update_query, (in_cart_value, user_id, product_id))
        else:
            # Dodanie nowego produktu do koszyka
            insert_query = "INSERT INTO Shopping (UserID, produktID, in_cart) VALUES (%s, %s, %s)"
            with db_connector.get_connection().cursor() as cursor:
                cursor.execute(insert_query, (user_id, product_id, in_cart_value))

        # Zatwierdzenie zmian w bazie danych
        db_connector.get_connection().commit()

        return jsonify({"message": "Updated in_cart value successfully!"})

    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        db_connector.disconnect()


@app.route('/api/Icer/get_notifications', methods=['POST'])
def get_notifications():
    try:
        db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")
        db_connector.connect()

        scheduler = BackgroundScheduler()
        scheduler.add_job(run_daily_procedure, 'interval', seconds=60)
        scheduler.start()

        connection = db_connector.get_connection()
        if not connection:
            raise ConnectionError("Failed to establish a connection with the database.")

        cursor = connection.cursor(dictionary=True)
        if not cursor:
            raise Exception("Failed to create a cursor for the database.")

        data = request.get_json()
        received_session_id = data.get('sessionId', None)
        if not received_session_id:
            raise ValueError("Session ID not provided")

        if 'username' not in session:
            raise PermissionError("User not logged in")

        username = session['username']
        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()
        if not user_result:
            raise LookupError("User not found")

        user_id = user_result['id']

        query = """
                    SELECT Icer.id, Icer.UserID, Icer.produktID, Icer.ilosc, 
                    Icer.data_waznosci, Icer.trzecia_wartosc, Icer.default_photo,
                    IF(Icer.default_photo = 1, Photos.lokalizacja, UserPhotos.lokalizacja) AS zdjecie_lokalizacja,
                    Produkty.nazwa, Produkty.cena, Produkty.kalorie,
                    Produkty.tluszcze, Produkty.weglowodany, Produkty.bialko,
                    Produkty.kategoria
                    FROM Icer
                    INNER JOIN Produkty ON Icer.produktID = Produkty.id
                    LEFT JOIN Photos ON Icer.produktID = Photos.produktID
                    LEFT JOIN UserPhotos ON Icer.produktID = UserPhotos.produktID AND UserPhotos.userID = %s
                    WHERE Icer.UserID = %s AND Icer.powiadomienie = 1
                """
        cursor.execute(query, (user_id, user_id))
        results = cursor.fetchall()

        filtered_results = [result for result in results]

        return jsonify(filtered_results)

        # Obsługa błędów
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except PermissionError as pe:
        return jsonify({"error": str(pe)}), 401
    except LookupError as le:
        return jsonify({"error": str(le)}), 404
    except ConnectionError as ce:
        return jsonify({"error": str(ce)}), 500
    except Exception as error:
        current_app.logger.error(f"Unexpected error: {error}")
        return jsonify({"error": "Unexpected server error"}), 500
    finally:
        if cursor:
            cursor.close()


@app.route('/api/productsRedFlag', methods=['POST', 'GET'])
def get_products_with_red_flag():
    print("test?")
    # Tworzenie instancji klasy DatabaseConnector
    db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")

    # Łączenie z bazą danych
    db_connector.connect()

    try:
        # Uzyskanie połączenia z bazą danych
        connection = db_connector.get_connection()
        if not connection:
            raise ConnectionError("Failed to establish a connection with the database.")

        cursor = connection.cursor(dictionary=True)
        if not cursor:
            raise Exception("Failed to create a cursor for the database.")

        data = request.get_json()

        # Upewnienie się co do sesji
        received_session_id = data.get('sessionId', None)
        if not received_session_id:
            raise ValueError("Session ID not provided")

        # Jeśli użytkownik nie jest zalogowany
        if 'username' not in session:
            raise PermissionError("User not logged in")

        # Pobranie ID aktualnie zalogowanego użytkownika
        username = session['username']

        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()
        if not user_result:
            raise LookupError("User not found")

        # Modyfikacja zapytania SQL, aby pokazywać tylko te produkty z flagą 1
        user_id = user_result['id']
        query = """
            SELECT Icer.id, Icer.UserID, Icer.produktID, Icer.ilosc, 
                   Icer.data_waznosci, Icer.trzecia_wartosc,
                   Produkty.nazwa, Produkty.cena, Produkty.kalorie,
                   Produkty.tluszcze, Produkty.weglowodany, Produkty.bialko,
                   Produkty.kategoria
            FROM Icer
            INNER JOIN Produkty ON Icer.produktID = Produkty.id
            WHERE Icer.UserID = %s AND Icer.trzecia_wartosc >= 1
        """
        cursor.execute(query, (user_id,))
        results = cursor.fetchall()

        return jsonify(results)

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except PermissionError as pe:
        return jsonify({"error": str(pe)}), 401
    except LookupError as le:
        return jsonify({"error": str(le)}), 404
    except ConnectionError as ce:
        return jsonify({"error": str(ce)}), 500
    except Exception as error:
        # Tutaj możemy logować błąd w bardziej szczegółowy sposób
        current_app.logger.error(f"Unexpected error: {error}")
        return jsonify({"error": "Unexpected server error"}), 500

    finally:
        if cursor:
            cursor.close()


# Funkcja do obsługi wysyłania zdjęcia do API Icer
@app.route('/api/Icer/upload_image', methods=['POST'])
def upload_image():
    try:
        data = request.get_json()
        image_name = data.get('imageName')
        image_data_base64 = data.get('imageData')  # Zakładając, że obraz jest przesłany jako ciąg zakodowany Base64
        user_id = data.get('userId')
        product_id = data.get('productId')

        if not image_name or not image_data_base64 or not user_id or not product_id:
            raise ValueError("Missing required data for image upload")

        # Odkodowanie danych obrazu z Base64
        image_data = base64.b64decode(image_data_base64)

        # Tutaj można ustawić lokalizację folderu, gdzie mają być zapisane obrazy
        images_folder = 'D:\\Pobrrane\\projekty Adika\\Projekt-PWAAdi\\icer\\src\\data'

        # Tworzenie ścieżki do zapisu obrazu
        image_path = os.path.join(images_folder, image_name)

        # Zapis odkodowanego obrazu na serwerze
        with open(image_path, 'wb') as image_file:
            image_file.write(image_data)

        # Tutaj należy uzyskać połączenie z bazą danych
        connection = db_connector.connect()
        cursor = connection.cursor()

        # Zapis informacji o zdjęciu do bazy danych w tabeli UserPhotos
        insert_query = "INSERT INTO UserPhotos (produktID, userID, lokalizacja) VALUES (%s, %s, %s)"
        cursor.execute(insert_query, (product_id, user_id, image_name))
        connection.commit()

        # Aktualizacja flagi default_photo w tabeli Icer dla konkretnego produktu użytkownika na 0
        update_query = "UPDATE Icer SET default_photo = 0 WHERE UserID = %s AND produktID = %s"
        cursor.execute(update_query, (user_id, product_id))
        connection.commit()

        cursor.close()

        return jsonify({"message": "Image uploaded and information saved successfully"})

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route('/api/Icer', methods=['POST'])
def get_icer():
    # Tworzenie instancji klasy DatabaseConnector
    db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")

    # Łączenie z bazą danych
    db_connector.connect()

    scheduler = BackgroundScheduler()
    scheduler.add_job(run_daily_procedure, 'interval', seconds=60)
    scheduler.start()

    try:

        # Uzyskanie połączenia z bazą danych
        connection = db_connector.get_connection()
        if not connection:
            raise ConnectionError("Failed to establish a connection with the database.")

        cursor = connection.cursor(dictionary=True)
        if not cursor:
            raise Exception("Failed to create a cursor for the database.")

        data = request.get_json()

        # Upewnienie się co do sesji
        received_session_id = data.get('sessionId', None)
        if not received_session_id:
            raise ValueError("Session ID not provided")

        # Jeśli użytkownik nie jest zalogowany
        if 'username' not in session:
            raise PermissionError("User not logged in")

        # Pobranie ID aktualnie zalogowanego użytkownika
        username = session['username']

        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()
        if not user_result:
            raise LookupError("User not found")

        # Modyfikacja zapytania SQL, aby pokazywać wszystkie informacje o produkcie
        user_id = user_result['id']
        query = """
            SELECT Icer.id, Icer.UserID, Icer.produktID, Icer.ilosc, 
            Icer.data_waznosci, Icer.trzecia_wartosc, Icer.default_photo,
            IF(Icer.default_photo = 1, Photos.lokalizacja, UserPhotos.lokalizacja) AS zdjecie_lokalizacja,
            Produkty.nazwa, Produkty.cena, Produkty.kalorie,
            Produkty.tluszcze, Produkty.weglowodany, Produkty.bialko,
            Produkty.kategoria
            FROM Icer
            INNER JOIN Produkty ON Icer.produktID = Produkty.id
            LEFT JOIN Photos ON Icer.produktID = Photos.produktID
            LEFT JOIN UserPhotos ON Icer.produktID = UserPhotos.produktID AND UserPhotos.userID = %s
            WHERE Icer.UserID = %s
            ORDER BY Icer.data_dodania ASC
        """
        cursor.execute(query, (user_id, user_id))
        results = cursor.fetchall()

        for result in results:
            zdjecie_lokalizacja = result['zdjecie_lokalizacja']
            if zdjecie_lokalizacja:
                # Tutaj zdjecie_lokalizacja będzie zawierać lokalizację zdjęcia z odpowiedniej tabeli
                print(zdjecie_lokalizacja)
            else:
                # Obsługa, gdy lokalizacja zdjęcia nie została znaleziona
                print("Brak lokalizacji zdjęcia")

        return jsonify(results)

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except PermissionError as pe:
        return jsonify({"error": str(pe)}), 401
    except LookupError as le:
        return jsonify({"error": str(le)}), 404
    except ConnectionError as ce:
        return jsonify({"error": str(ce)}), 500
    except Exception as error:
        # Tutaj możemy logować błąd w bardziej szczegółowy sposób
        current_app.logger.error(f"Unexpected error: {error}")
        return jsonify({"error": "Unexpected server error"}), 500

    finally:
        if cursor:
            cursor.close()


@app.route('/api/Icer/delete_notification', methods=['POST'])
def delete_notification():
    try:
        # Tworzenie instancji klasy DatabaseConnector
        db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")
        # Łączenie z bazą danych
        db_connector.connect()

        data = request.get_json()
        received_session_id = data.get('sessionId', None)
        if not received_session_id:
            raise ValueError("Session ID not provided")

        if 'username' not in session:
            raise PermissionError("User not logged in")

        username = session['username']
        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)
        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()

        if not user_result:
            raise LookupError("User not found")

        user_id = user_result['id']

        notification_id = data.get('notificationId')
        notification_value = data.get('notificationValue')

        if notification_value in [0, 1, None] and notification_id is not None:
            # Usunięcie lub aktualizacja powiadomienia o konkretnym ID danego użytkownika
            update_notification_query = "UPDATE Icer SET powiadomienie = %s WHERE id = %s AND UserID = %s"
            cursor.execute(update_notification_query, (notification_value, notification_id, user_id))
            connection.commit()
            return jsonify({"message": f"Notification with ID {notification_id} updated successfully"})

        else:
            return jsonify({"error": "Invalid notification value or missing notification ID."}), 400

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except PermissionError as pe:
        return jsonify({"error": str(pe)}), 401
    except LookupError as le:
        return jsonify({"error": str(le)}), 404
    except ConnectionError as ce:
        return jsonify({"error": str(ce)}), 500
    except Exception as error:
        current_app.logger.error(f"Unexpected error: {error}")
        return jsonify({"error": "Unexpected server error"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route('/api/Icer/delete_all_notification', methods=['POST'])
def delete_all_notification():
    try:
        # Tworzenie instancji klasy DatabaseConnector
        db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")
        # Łączenie z bazą danych
        db_connector.connect()

        data = request.get_json()
        received_session_id = data.get('sessionId', None)
        if not received_session_id:
            raise ValueError("Session ID not provided")

        if 'username' not in session:
            raise PermissionError("User not logged in")

        username = session['username']
        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)
        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()

        if not user_result:
            raise LookupError("User not found")

        user_id = user_result['id']

        # Usunięcie wszystkich powiadomień danego użytkownika
        delete_all_notifications_query = "UPDATE Icer SET powiadomienie = NULL WHERE UserID = %s"
        cursor.execute(delete_all_notifications_query, (user_id,))
        connection.commit()
        return jsonify({"message": "All user notifications deleted successfully"})

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except PermissionError as pe:
        return jsonify({"error": str(pe)}), 401
    except LookupError as le:
        return jsonify({"error": str(le)}), 404
    except ConnectionError as ce:
        return jsonify({"error": str(ce)}), 500
    except Exception as error:
        current_app.logger.error(f"Unexpected error: {error}")
        return jsonify({"error": "Unexpected server error"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# Pobieranie danych produktów
@app.route('/api/products', methods=['GET'])
def get_products():
    # Tworzenie instancji klasy ProductData
    product_data = ProductData(db_connector.get_connection())
    products = product_data.fetch_products()
    return jsonify(products)


from flask import session, jsonify, request
import uuid  # potrzebne do generowania unikalnych ID sesji


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        password = data['password']
        print("funkcja login")
        # Sprawdzanie, czy użytkownik istnieje w bazie danych
        if check_user(username, password):
            # Utworzenie sesji dla zalogowanego użytkownika
            session['username'] = username
            session_id = str(uuid.uuid4())  # Generowanie unikalnego ID sesji
            session['session_id'] = session_id  # Przechowywanie ID sesji
            print("sesja" + session['session_id'] + "sessionid: " + session_id)
            return jsonify({"message": "Login successful", "session_id": session_id})


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
            # Szyfrowanie nowego hasła
            hashed_new_pw = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
            query = "UPDATE Users SET password = %s WHERE username = %s"
            values = (hashed_new_pw, session['username'])
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


@app.route('/', methods=['GET', 'POST'])
def index():
    bot_response = ""
    #barcode_form = BarcodeForm()  # For barcode form
    if request.method == 'POST':
        user_input = request.form['user_input']
        bot_response = get_bot_response(user_input)
    response = make_response(render_template('index.html', bot_response=bot_response, ))
    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    return response


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


# @app.route('/generate_barcode', methods=['POST'])
# def generate_barcode_route():
    # if request.method == 'POST':
        # data = {
            # "name": request.form['name'],
            # "price": request.form['price'],
            # "kcal": request.form['kcal'],
            # "fat": request.form['fat'],
            # "carbs": request.form['carbs'],
            # "protein": request.form['protein'],
            # "category": request.form['category'],
            # "amount": request.form['amount']
        # }
        # barcode_image_filename = generate_barcode(data, app.config['BARCODE_FOLDER'])
        # barcode_image_path = os.path.join(app.config['BARCODE_FOLDER'], barcode_image_filename)
        # return send_file(barcode_image_path, mimetype='image/png', as_attachment=True)


# @app.route('/decode_barcode', methods=['POST'])
# def decode_barcode_route():
    # if 'barcode_image' not in request.files:
        # return "No barcode image uploaded"

    # barcode_image = request.files['barcode_image']
    # if barcode_image.filename == '':
        # return "No selected file"

    # barcode_image_path = os.path.join(app.config['BARCODE_FOLDER'], barcode_image.filename)
    # barcode_image.save(barcode_image_path)

    # decoded_data = decode_barcode(barcode_image_path)

    # return f"Decoded Barcode Data: {decoded_data}"


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


@app.route('/start_food_identification', methods=['POST'])
def start_food_identification_route():
    camera_thread = threading.Thread(target=foodIdent)
    camera_thread.start()
    return redirect(url_for('index'))


# Route for video streaming
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


camera_thread = None


# Remove the start_camera_monitoring route
# Replace it with a route that redirects to a page where the video is displayed
@app.route('/start_camera_monitoring', methods=['POST'])
def start_camera_monitoring_route():
    global camera_thread

    if camera_thread is None or not camera_thread.is_alive():
        # Start the camera monitoring in a new thread
        camera_thread = threading.Thread(target=generate_frames)
        camera_thread.start()

    return redirect(url_for('display_video'))


@app.route('/display_video')
def display_video():
    # Render a template that will display the video
    return render_template('display_video.html')
    
    
@app.route('/upload_image', methods=['GET', 'POST'])
def upload_predict():
    if request.method == 'POST':
        # Get the file from post request
        file = request.files['file']

        # Define a directory to save the file (make sure this directory exists)
        upload_folder = 'static/uploads/'
        filename = upload_folder + file.filename
        file.save(filename)

        # Make prediction
        pred_class = pred_and_plot(model, filename, class_names)

        # Generate the URL for the saved image
        image_url = url_for('static', filename='uploads/' + file.filename)

        return render_template('result.html', prediction=pred_class, image_file=image_url)

    return render_template('upload.html')
    
@app.route('/camera_control', methods=['GET'])
def camera_control():
    return render_template('camera_control.html')

@app.route('/start_camera', methods=['POST'])
def start_camera_route():
    start_camera()
    return "Camera started."

@app.route('/stop_camera', methods=['POST'])
def stop_camera_route():
    stop_camera()
    return "Camera stopped."



# Strona wylogowania
@app.route('/logout')
def logout():
    # Usunięcie sesji
    session.pop('username', None)
    return redirect('/login')


if __name__ == '__main__':
    app.run(host='0.0.0.0')
