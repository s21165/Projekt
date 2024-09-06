import json
import os
import uuid  # potrzebne do generowania unikalnych ID sesji
from datetime import timedelta, datetime
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
from email.header import Header
import secrets
import string
import jwt
from dotenv import load_dotenv
import base64
import cv2
from flask import session, jsonify, request
import numpy as np
from PIL import Image
import stripe
import logging
import traceback

import bcrypt
from flask import Flask
from flask import current_app
from flask import render_template, redirect, url_for, make_response, \
    flash, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO
from werkzeug.utils import secure_filename

from modules.advert_module.monitor import detect_faces_and_eyes, preload_haar
from modules.bot_module.bot import get_bot_response
from modules.database_connector import DatabaseConnector
from modules.foodIdent_module.foodIdent import pred_and_plot, load_model
from modules.foodIdent_module.foodIdentVideo import clear_food_username, \
    predict_and_update_food_list, preload
from modules.image_handler import handle_image_upload, change_user_profile
from modules.scan_module.decoder import decode_qr_code, decode_qr_code_frames
from modules.scan_module.gen import generate_qr_code
from modules.value_manager import ProductManager

load_dotenv()



app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")
app.config['BARCODE_FOLDER'] = os.path.join('static/', 'barcodes')
app.config['QR_CODE_FOLDER'] = os.path.join('static/', 'qrcodes')
app.config['FOOD_LIST_DIR'] = 'users_lists'
# Uzyskaj ścieżkę do katalogu głównego (gdzie znajduje się mainAPI.py)
base_dir = os.path.dirname(os.path.abspath(__file__))
# Ścieżka do katalogu tmp
temp_dir = os.path.join(base_dir, 'tmp')
os.makedirs(temp_dir, exist_ok=True)
# Ścieżka do katalogu z plikami wideo
video_dir = os.path.join(base_dir, 'static', 'adverts')
preload()
# Upewnij się, że katalog tmp istnieje
os.makedirs(temp_dir, exist_ok=True)

# Status video, domyślnie false
video_state = {
    "playing": False,
    "video_choice": None
}

# Ladowanie modelu do /upload_test_AI_QR
model = load_model('model3.h5')
print("Image model loaded successfully:", model is not None)

# Otwórz plik JSON i załaduj jego zawartość
json_file_path = 'modules/foodIdent_module/classes.json'
with open(json_file_path, 'r') as json_file:
    data = json.load(json_file)
# Pobierz listę nazw klas z załadowanych danych
class_names = data.get('class_names', [])

# Dopuszczone rozszerzenia do ładowanych plików
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


# Funkcja sprawdza, czy podany plik ma dozwolone rozszerzenie.
def allowed_file(filename):
    # Sprawdź, czy nazwa pliku zawiera kropkę i czy rozszerzenie pliku jest dozwolone
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Ustal lokalizację katalogu repozytorium (root project directory)
repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Pobieranie ścieżki do pliku logów z .env
log_file_path = os.getenv('LOG_FILE_PATH', 'zaplecze/logs/application.log')
# Tworzenie pełnej ścieżki do pliku logów
full_log_file_path = os.path.join(repo_root, log_file_path)
environment = os.getenv('ENVIRONMENT')
# Konfiguracja logowania
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

@app.route('/api/add_to_product', methods=['POST'])
def add_to_product():
    # Tworzenie instancji klasy DatabaseConnector
    db_connector = DatabaseConnector()

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
    # Tworzenie instancji klasy DatabaseConnector
    db_connector = DatabaseConnector()

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
    db_connector = DatabaseConnector()

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
    try:
        # Tworzenie instancji klasy DatabaseConnector
        db_connector = DatabaseConnector()

        # Łączenie z bazą danych
        db_connector.connect()

        # Tworzenie instancji ProductManager
        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)
        # Sprawdzenie, czy użytkownik jest zalogowany
        user_id, username, response, status_code = DatabaseConnector.get_user_id_by_username(cursor, session)
        if response:
            return response, status_code

        # Pobranie informacji o produkcie z żądania
        data = request.get_json()

        # Obsługa błędu dla braku klucza 'produktID' w żądaniu
        try:
            product_id = data['produktID']
        except KeyError:
            return jsonify({"error": "produktID is required"}), 400
        query_to_execute = f"CALL ModifyProductQuantity({product_id}, {user_id}, 'remove');"

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
        db_connector = DatabaseConnector()
        # Łączenie z bazą danych
        db_connector.connect()
        # Tworzenie instancji ProductManager
        product_manager = ProductManager(db_connector)
        # Pobieranie danych z żądania
        data = request.json

        # Sprawdzenie, czy wszystkie wymagane dane są dostępne
        required_fields = ['nazwa', 'cena', 'kalorie', 'tluszcze', 'weglowodany', 'bialko', 'kategoria', 'ilosc', 'data_waznosci']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Brakuje wymaganych danych: {', '.join(missing_fields)}"}), 400

        image_data = data.get('imageData')
        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)

        # Sprawdzenie, czy użytkownik jest zalogowany
        user_id, username, response, status_code = DatabaseConnector.get_user_id_by_username(cursor, session)
        if response:
            return response, status_code

        # Sprawdzenie, czy istnieje produkt z takimi samymi wartościami i który jest podstawowy
        check_product_query = """
            SELECT id 
            FROM Produkty 
            WHERE nazwa = %s 
              AND cena = %s 
              AND kalorie = %s 
              AND tluszcze = %s 
              AND weglowodany = %s 
              AND bialko = %s 
              AND kategoria = %s 
              AND podstawowy = 1
        """
        cursor.execute(check_product_query, (
            data['nazwa'],
            data['cena'],
            data['kalorie'],
            data['tluszcze'],
            data['weglowodany'],
            data['bialko'],
            data['kategoria']
        ))
        product_exists = cursor.fetchone()

        if product_exists:
            product_id = product_exists['id']
        else:
            # Jeśli taki produkt nie istnieje, dodaj nowy produkt
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
                return jsonify({"error": "Nie udało się dodać produktu do tabeli Produkty."}), 500

        # Dodanie daty dodania do tabeli 'Icer'
        add_icer_query = """
            INSERT INTO Icer (UserID, produktID, ilosc, data_waznosci, data_dodania)
            VALUES (%s, %s, %s, %s, NOW())
        """
        cursor.execute(add_icer_query, (user_id, product_id, data['ilosc'], data['data_waznosci']))

        # Wywołanie procedury UpdateSwiezosc dla nowo dodanego produktu
        cursor.callproc('UpdateSwiezosc', (cursor.lastrowid,))

        # Wywołanie funkcji do obsługi przesyłania zdjęcia tylko jeśli dostępne są dane zdjęcia
        if image_data:
            handle_image_upload(db_connector, image_data, user_id, product_id)

        connection.commit()
        cursor.close()
        return jsonify({"message": "Produkt dodany poprawnie!"})
    except KeyError as ke:
        # Obsługa brakujących kluczy w danych wejściowych
        return jsonify({"error": f"Brakuje wymaganego pola: {str(ke)}"}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route('/api/edit_product/<int:product_id>', methods=['PUT'])
def edit_product(product_id):
    # Tworzenie instancji klasy DatabaseConnector
    db_connector = DatabaseConnector()
    # Łączenie z bazą danych
    db_connector.connect()
    try:
        # Pobieranie danych produktu z żądania
        data = request.json
        image_data = data.get('imageData')
        # Pobieranie user_id z funkcji get_user_id_by_username
        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)
        # Sprawdzenie, czy użytkownik jest zalogowany
        user_id, username, response, status_code = DatabaseConnector.get_user_id_by_username(cursor, session)
        if response:
            cursor.close()
            connection.close()
            return response, status_code
        # Aktualizacja produktu w bazie danych
        new_product_id = db_connector.update_product(product_id, data, user_id)
        # Jeśli new_product_id nie jest None, oznacza to, że został utworzony nowy produkt
        if new_product_id is not None:
            product_id_to_use = new_product_id
        else:
            product_id_to_use = product_id
        # Wywołanie funkcji do obsługi przesyłania zdjęcia tylko jeśli dostępne są dane zdjęcia
        if image_data:  # Dodatkowa warunek sprawdzający, czy jest nowe id produktu
            handle_image_upload(db_connector, image_data, user_id, product_id_to_use)
        cursor.close()
        connection.close()
        return jsonify({"message": "Produkt został zaktualizowany!"})
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route('/api/shoppingList', methods=['POST', 'GET'])
def get_icer_shopping():
    # Tworzenie instancji klasy DatabaseConnector
    db_connector = DatabaseConnector()
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
          SELECT Icer.id, Icer.UserID, Icer.produktID, Shopping.ilosc,
       Produkty.nazwa, Produkty.cena, Produkty.kalorie,
       Produkty.tluszcze, Produkty.weglowodany,
       Produkty.bialko, Produkty.kategoria
FROM Icer
INNER JOIN Produkty ON Icer.produktID = Produkty.id
INNER JOIN Shopping ON Icer.produktID = Shopping.produktID 
                     AND Icer.UserID = Shopping.UserID 
                     AND Shopping.in_cart = 1
WHERE Icer.UserID = %s;
        """
        cursor.execute(query, (user_id,))
        results = cursor.fetchall()
        # Obsługa błędów
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
        logging.error(f'Błąd get_icer: {error}')
        return jsonify({"error": "Unexpected server error"}), 500
    finally:
        if cursor:
            cursor.close()


@app.route('/api/edit_shopping_cart', methods=['POST'])
def edit_shopping_cart():
    try:
        # Tworzenie instancji klasy DatabaseConnector
        db_connector = DatabaseConnector()

        # Łączenie z bazą danych
        db_connector.connect()

        # Tworzenie instancji ProductManager
        product_manager = ProductManager(db_connector)

        # Pobieranie danych z żądania
        data = request.json

        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)
        # Sprawdzenie, czy użytkownik jest zalogowany
        user_id, username, response, status_code = DatabaseConnector.get_user_id_by_username(cursor, session)
        if response:
            return response, status_code

        # Pobranie wartości in_cart z żądania (1 lub 0)
        in_cart_value = data.get('inCart')

        if in_cart_value == 0:
            # Jeśli nie przekazano żadnego produktu, usuń wszystkie produkty z koszyka
            if 'productID' not in data:
                delete_query = "DELETE FROM Shopping WHERE UserID = %s"
                with db_connector.get_connection().cursor() as cursor:
                    cursor.execute(delete_query, (user_id,))
            else:
                # Usuwanie pojedynczego produktu z koszyka
                product_id = data.get('productID')
                delete_query = "DELETE FROM Shopping WHERE UserID = %s AND produktID = %s"
                with db_connector.get_connection().cursor() as cursor:
                    cursor.execute(delete_query, (user_id, product_id))
        else:
            # Dodawanie lub aktualizowanie koszyka
            product_id = data.get('productID')

            if product_id is None:
                # Sprawdzenie, czy dostarczono wymagane dane (nazwa, cena, ilość)
                if 'nazwa' not in data or 'cena' not in data or 'ilosc' not in data:
                    return jsonify(
                        {"error": "Product ID not provided, and missing required data (nazwa, cena, ilosc)"}), 400
                product_id = product_manager.dodaj_produkt(data['nazwa'], data['cena'])

                # Dodanie nowego produktu do koszyka
                insert_query = "INSERT INTO Shopping (UserID, produktID, in_cart, ilosc) VALUES (%s, %s, %s, %s)"
                with db_connector.get_connection().cursor() as cursor:
                    cursor.execute(insert_query, (user_id, product_id, 1, data["ilosc"]))

                    add_icer_query = """
                        INSERT INTO Icer (UserID, produktID, ilosc, data_dodania)
                        VALUES (%s, %s, %s, NOW())
                    """
                    cursor.execute(add_icer_query, (user_id, product_id, 0))

            else:
                if in_cart_value not in [0, 1]:
                    return jsonify({"error": "Invalid inCart value"}), 400

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
                    insert_query = "INSERT INTO Shopping (UserID, produktID, in_cart, ilosc) VALUES (%s, %s, %s, %s)"
                    with db_connector.get_connection().cursor() as cursor:
                        cursor.execute(insert_query, (user_id, product_id, in_cart_value, data['ilosc']))

        # Zatwierdzenie zmian w bazie danych
        db_connector.get_connection().commit()

        return jsonify({"message": "Updated in_cart value successfully!"})

    except Exception as error:
        return jsonify({"error": str(error)}), 500
    finally:
        db_connector.disconnect()


@app.route('/api/Icer/get_notifications', methods=['POST'])
def get_notifications():
    cursor = None
    try:
        db_connector = DatabaseConnector()
        db_connector.connect()

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
            Icer.data_waznosci, Icer.swiezosc, Icer.default_photo,
            Icer.powiadomienie,
            IF(Icer.default_photo = 1, Photos.lokalizacja, UserPhotos.lokalizacja) AS zdjecie_lokalizacja,
            Produkty.nazwa, Produkty.cena, Produkty.kalorie,
            Produkty.tluszcze, Produkty.weglowodany, Produkty.bialko,
            Produkty.kategoria
            FROM Icer
            INNER JOIN Produkty ON Icer.produktID = Produkty.id
            LEFT JOIN Photos ON Icer.produktID = Photos.produktID
            LEFT JOIN UserPhotos ON Icer.produktID = UserPhotos.produktID AND UserPhotos.userID = %s
            WHERE Icer.UserID = %s AND Icer.powiadomienie <= 1 
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
    # Tworzenie instancji klasy DatabaseConnector
    db_connector = DatabaseConnector()

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
                   Icer.data_waznosci, Icer.swiezosc,
                   Produkty.nazwa, Produkty.cena, Produkty.kalorie,
                   Produkty.tluszcze, Produkty.weglowodany, Produkty.bialko,
                   Produkty.kategoria
            FROM Icer
            INNER JOIN Produkty ON Icer.produktID = Produkty.id
            WHERE Icer.UserID = %s AND Icer.swiezosc >= 1
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
        logging.error(f'Błąd get_icer: {error}')
        return jsonify({"error": "Unexpected server error"}), 500

    finally:
        if cursor:
            cursor.close()


@app.route('/api/Icer', methods=['POST'])
def get_icer():
    # Tworzenie instancji klasy DatabaseConnector
    db_connector = DatabaseConnector()
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
        # Sprawdzenie, czy użytkownik jest zalogowany
        user_id, username, response, status_code = DatabaseConnector.get_user_id_by_username(cursor, session)
        if response:
            return response, status_code
        # Modyfikacja zapytania SQL, aby pokazywać wszystkie informacje o produkcie
        query = """
            SELECT DISTINCT Icer.id, Icer.UserID, Icer.produktID, Icer.ilosc, 
                   Icer.data_waznosci, Icer.swiezosc, Icer.default_photo,
                   IF(Icer.default_photo = 1, Photos.lokalizacja, UserPhotos.lokalizacja) AS zdjecie_lokalizacja,
                   Produkty.nazwa, Produkty.cena, Produkty.kalorie,
                   Produkty.tluszcze, Produkty.weglowodany, Produkty.bialko,
                   Produkty.kategoria,
                   Icer.data_dodania
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
            if  zdjecie_lokalizacja:
                # Odkodowanie  zdjęcia z Base64
                try:
                    image_path = os.path.join("../zaplecze/photos", zdjecie_lokalizacja)
                    with open(image_path, "rb") as image_file:
                        encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
                    result['zdjecie_lokalizacja'] = encoded_image
                except FileNotFoundError:
                    logging.info(f"error w kodowaniu zdjęcia")
                    # Obsługa, gdy plik zdjęcia nie został znaleziony
                    result['zdjecie_lokalizacja'] = None
            else:
                # Obsługa, gdy lokalizacja zdjęcia nie została znaleziona
                result['zdjecie_lokalizacja'] = None
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
        logging.error(f'Błąd get_icer: {error}')
        return jsonify({"error": "Unexpected server error"}), 500
    finally:
        if cursor:
            cursor.close()


@app.route('/api/Icer/delete_notification', methods=['POST'])
def delete_notification():
    try:
        # Tworzenie instancji klasy DatabaseConnector
        db_connector = DatabaseConnector()
        # Łączenie z bazą danych
        db_connector.connect()

        data = request.get_json()
        received_session_id = data.get('sessionId', None)
        if not received_session_id:
            raise ValueError("Session ID not provided")

        # sprawdzenie czy użytkownik jest zalogowany
        if 'username' not in session:
            raise PermissionError("User not logged in")

        # pobieranie wartości nazwy użytkownika oraz sprawdzenie czy użytkownik istnieje
        username = session['username']
        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)
        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()

        if not user_result:
            raise LookupError("User not found")

        user_id = user_result['id']
        # sprawdza wartosc przeslana przez front notification i zaleznie od tego zmienia wartosci notification
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
        db_connector = DatabaseConnector()
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

        notification_value = data.get('notificationValue')

        # Usunięcie wszystkich powiadomień danego użytkownika
        if notification_value == 0:
            # Aktualizacja tylko tych powiadomień, które mają wartość 1
            update_notifications_query = "UPDATE Icer SET powiadomienie = %s WHERE powiadomienie = 1 AND UserID = %s"
            cursor.execute(update_notifications_query, (notification_value, user_id))
            connection.commit()
            return jsonify({"message": "All user notifications updated successfully"})

        elif notification_value in [0, 1, None]:
            # Aktualizacja wszystkich powiadomień danego użytkownika
            update_all_notifications_query = "UPDATE Icer SET powiadomienie = %s WHERE UserID = %s"
            cursor.execute(update_all_notifications_query, (notification_value, user_id))
            connection.commit()
            return jsonify({"message": "All user notifications updated successfully"})

        else:
            return jsonify({"error": "Invalid notification value."}), 400

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


# Endpoint do aktualizacji preferencji użytkownika
@app.route('/api/update_preferences', methods=['POST'])
def update_preferences():
    try:
        # Tworzenie instancji klasy DatabaseConnector
        db_connector = DatabaseConnector()
        # Łączenie z bazą danych
        db_connector.connect()
        # Pobieranie danych z żądania
        data = request.json

        # Funkcja do walidacji rozmiaru
        def validate_size(value):
            valid_sizes = ['bardzo male', 'male', 'srednie', 'duze', 'bardzo duze']
            return value.lower() in valid_sizes
        # Sprawdzenie poprawności wartości
        if not validate_size(data['wielkosc_lodowki']) or not validate_size(data['wielkosc_strony_produktu']):
            return jsonify({"error": "Nieprawidłowe wartości wielkości."}), 400
        connection = db_connector.get_connection()

        cursor = connection.cursor(dictionary=True)
        # Sprawdzenie, czy użytkownik jest zalogowany
        user_id, username, response, status_code = DatabaseConnector.get_user_id_by_username(cursor, session)
        if response:
            return response, status_code
        # Sprawdzenie, czy istnieje wpis w tabeli preferencje_uzytkownikow
        check_preferences_query = """
            SELECT UserID FROM preferencje_uzytkownikow WHERE UserID = %s
        """
        cursor.execute(check_preferences_query, (user_id,))
        existing_user = cursor.fetchone()
        if existing_user:
            # Aktualizacja preferencji użytkownika
            update_preferences_query = """
                UPDATE preferencje_uzytkownikow
                SET wielkosc_lodowki = %s, wielkosc_strony_produktu = %s, 
                    widocznosc_informacji_o_produkcie = %s
                WHERE UserID = %s
            """
            cursor.execute(update_preferences_query, (
                data['wielkosc_lodowki'], data['wielkosc_strony_produktu'],
                data['widocznosc_informacji_o_produkcie'],
                user_id))
        else:
            # Tworzenie nowego wpisu w tabeli preferencje_uzytkownikow
            insert_preferences_query = """
                INSERT INTO preferencje_uzytkownikow 
                (UserID, wielkosc_lodowki, wielkosc_strony_produktu, 
                 widocznosc_informacji_o_produkcie)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(insert_preferences_query, (
                user_id, data['wielkosc_lodowki'], data['wielkosc_strony_produktu'],
                data['widocznosc_informacji_o_produkcie']))

        connection.commit()
        cursor.close()
        return jsonify({"message": "Preferencje zaktualizowane"})
    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route('/api/get_user_preferences', methods=['GET'])
def get_user_preferences():
    try:
        # Tworzenie instancji klasy DatabaseConnector
        db_connector = DatabaseConnector()
        # Łączenie z bazą danych
        db_connector.connect()
        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)
        # Sprawdzenie, czy użytkownik jest zalogowany
        user_id, username, response, status_code = DatabaseConnector.get_user_id_by_username(cursor, session)
        if response:
            return response, status_code

        # Pobieranie preferencji użytkownika i statusu premium
        get_preferences_query = """
            SELECT wielkosc_lodowki, wielkosc_strony_produktu, 
                   widocznosc_informacji_o_produkcie, lokalizacja_zdj, 
                   podstawowe_profilowe, uzytkownik_premium, data_koniec_premium
            FROM preferencje_uzytkownikow
            WHERE UserID = %s
        """
        cursor.execute(get_preferences_query, (user_id,))
        preferences = cursor.fetchone()
        if preferences:
            # Sprawdzenie, czy okres premium minął
            if preferences['uzytkownik_premium'] == 1 and preferences['data_koniec_premium']:
                if datetime.now().date() > preferences['data_koniec_premium']:
                    # Jeśli minął miesiąc od aktywacji premium, resetuj status
                    update_premium_status_query = """
                        UPDATE preferencje_uzytkownikow 
                        SET uzytkownik_premium = 0, data_koniec_premium = NULL 
                        WHERE UserID = %s
                    """
                    cursor.execute(update_premium_status_query, (user_id,))
                    connection.commit()
                    preferences['uzytkownik_premium'] = 0
                    preferences['data_koniec_premium'] = None

            # Odczytanie i zakodowanie zdjęcia profilowego w Base64
            if preferences['podstawowe_profilowe'] == 1:
                profile_photo_path = os.path.join("../zaplecze/photos/userProfilePicture", "face.jpg")
            else:
                profile_photo_path = os.path.join("../zaplecze/photos/userProfilePicture",
                                                  preferences['lokalizacja_zdj'])
            try:
                # Otwieranie i kodowanie zdjęcia do Base64
                with open(profile_photo_path, "rb") as image_file:
                    encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
                preferences['profile_photo'] = encoded_image
            except FileNotFoundError:
                preferences['profile_photo'] = None
            return jsonify(preferences)
        else:
            # Jeśli preferencje nie zostały znalezione, zwróć domyślne wartości
            default_preferences = {
                "wielkosc_lodowki": "srednie",
                "wielkosc_strony_produktu": "srednie",
                "widocznosc_informacji_o_produkcie": "1",
                "lokalizacja_zdj": None,
                "podstawowe_profilowe": "1",
                "uzytkownik_premium": "0",
                "data_koniec_premium": None,
                "profile_photo": None
            }
            return jsonify(default_preferences)

    except Exception as error:
        # Zwrócenie ogólnego błędu
        return jsonify({"error": str(error)}), 500

# Endpoint do zmiany zdjęcia użytkownika
@app.route('/api/change_user_photo', methods=['POST'])
def change_user_photo():
    try:
        # Tworzenie instancji klasy DatabaseConnector
        db_connector = DatabaseConnector()
        # Łączenie z bazą danych
        db_connector.connect()
        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)

        # Pobranie danych obrazu z zapytania
        data = request.get_json()
        image_data = data['image_data_base64']
        user_id, username, response, status_code = DatabaseConnector.get_user_id_by_username(cursor, session)
        # Wywołanie funkcji do zmiany zdjęcia użytkownika
        response = change_user_profile(db_connector, user_id, image_data)
        return response

    except Exception as error:
        return jsonify({"error": str(error)}), 500


@app.route('/api/update_food_list', methods=['POST'])
def update_food_list(food_list):
    try:
        # Tworzenie instancji klasy DatabaseConnector
        db_connector = DatabaseConnector()
        # Łączenie z bazą danych
        db_connector.connect()
        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)
        # Pobieranie danych produktów z bazy danych
        select_query = """
            SELECT nazwa, cena, kalorie, tluszcze, weglowodany, bialko, kategoria
            FROM Produkty
            WHERE podstawowy = 1 AND nazwa IN ({})
        """
        # Tworzenie ciągu znaków '?' do zastąpienia w zapytaniu SQL
        placeholders = ', '.join(['%s' for _ in range(len(food_list))])
        # Wypełnienie zapytania SQL odpowiednią liczbą znaków '?'
        formatted_query = select_query.format(placeholders)
        # Wykonaj zapytanie z uwzględnieniem listy produktów
        cursor.execute(formatted_query, tuple(food_list))
        products = cursor.fetchall()
        cursor.close()
        connection.close()

        # Utwórz listę słowników na podstawie wyników zapytania
        updated_food_list = []
        for product in products:
            product['ilosc'] = 1
            updated_food_list.append({
                "nazwa": product['nazwa'],
                "cena": float(product['cena']),
                "kalorie": int(product['kalorie']),
                "tluszcze": float(product['tluszcze']),
                "weglowodany": float(product['weglowodany']),
                "bialko": float(product['bialko']),
                "kategoria": product['kategoria'],
                "ilosc": 1  # Zawsze ustaw ilość na 1
            })
        # Zwróć zaktualizowaną listę produktów
        return updated_food_list
    except Exception as error:
        return {"error": str(error)}, 500


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"message": "Brak nazwy użytkownika lub hasła"}), 400

        result = check_user(username, password)

        if result == True:
            session['username'] = username
            session_id = str(uuid.uuid4())
            session['session_id'] = session_id
            return jsonify({"message": "Logowanie udane", "session_id": session_id})
        else:
            return result
    else:
        return jsonify({"message": "Metoda niedozwolona"}), 405


def user_exists(username):
    query = "SELECT * FROM Users WHERE username = %s"
    values = (username,)

    with DatabaseConnector() as db_connector:
        connection = db_connector.get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute(query, values)
                result = cursor.fetchone()
            return True if result else False
        except Exception as error:
            return False


def save_user(username, password):
    # Zaszyfruj hasło użytkownika
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    # Zdefiniuj zapytanie SQL do wstawienia użytkownika do bazy danych
    query = "INSERT INTO Users (username, password) VALUES (%s, %s)"
    values = (username, hashed_pw)

    # Utwórz instancję DatabaseConnector i użyj jej jako kontekstowy menedżer
    with DatabaseConnector() as db_connector:
        connection = db_connector.get_connection()
        cursor = None
        try:
            # Uzyskaj kursor do wykonywania zapytań SQL
            cursor = connection.cursor()
            # Wykonaj zapytanie wstawienia użytkownika do bazy danych
            cursor.execute(query, values)
            # Zatwierdź zmiany w bazie danych
            connection.commit()
            return True
        except Exception as error:
            if connection:
                # Cofnij transakcję w przypadku błędu
                connection.rollback()
            return False
        finally:
            # Upewnij się, że kursor jest zawsze zamykany
            if cursor:
                cursor.close()


SMTP_SERVER = 'smtp-mail.outlook.com'
SMTP_USER = 'icerpoland@outlook.com'
SMTP_PASSWORD = ',R/j2kL-DSQ6baX'
SMTP_PORT = 587


def send_verification_email(email, token):
    subject = 'Potwierdzenie rejestracji'
    if environment == 'LOCAL':
        link = f'http://localhost:5000/confirm_email/{token}'
    elif environment == 'PRODUCTION':
        link = f'https://icer.net.pl:8443/confirm_email/{token}'
    body = f'Kliknij w ten link, aby potwierdzić swoją rejestrację: {link}'

    msg = MIMEMultipart()
    msg['From'] = formataddr((str(Header('Icer Poland', 'utf-8')), SMTP_USER))
    msg['To'] = email
    msg['Subject'] = Header(subject, 'utf-8')

    # Użyj MIMEText z kodowaniem UTF-8 dla treści wiadomości
    msg.attach(MIMEText(body, 'plain', 'utf-8'))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Rozpocznij TLS
            server.login(SMTP_USER, SMTP_PASSWORD)  # Zaloguj się
            # Wyślij e-mail
            server.sendmail(SMTP_USER, email, msg.as_string().encode('utf-8'))
        logging.info(f'E-mail weryfikacyjny został wysłany do {email}')
    except Exception as e:
        logging.error(f'Błąd podczas wysyłania e-maila do {email}: {e}')


def generate_confirmation_token(email):
    expiration = datetime.utcnow() + timedelta(hours=24)
    token = jwt.encode(
        {'email': email, 'exp': expiration},
        app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    return token


@app.route('/confirm_email/<token>')
def confirm_email(token):
    try:
        email = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])['email']
        if confirm_user(email):
            if environment == 'LOCAL':
                return redirect('http://localhost:3000/login')
            elif environment == 'PRODUCTION':
                return redirect('https://icer.net.pl:443/login')
        else:
            return jsonify({"message": "Błąd podczas potwierdzania adresu e-mail."}), 500
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token wygasł."}), 400
    except jwt.InvalidTokenError:
        return jsonify({"message": "Nieprawidłowy token."}), 400


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('username')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Adres e-mail lub hasło są wymagane"}), 400

    if user_exists(email):
        return jsonify({"message": "Użytkownik z takim adresem e-mail już istnieje"}), 400

    if save_user(email, password):
        token = generate_confirmation_token(email)
        send_verification_email(email, token)
        return jsonify({"message": "Rejestracja udana. Sprawdź swoją skrzynkę pocztową, aby potwierdzić adres e-mail."})
    else:
        return jsonify({"message": "Błąd podczas rejestracji"}), 500


def confirm_user(email):
    db_connector = DatabaseConnector()
    db_connector.connect()

    connection = db_connector.get_connection()
    cursor = connection.cursor()

    try:
        query = "UPDATE Users SET zatwierdzony = %s WHERE username = %s"
        values = (True, email)

        cursor.execute(query, values)
        connection.commit()

        if cursor.rowcount > 0:
            return jsonify({"message": "Użytkownik został zatwierdzony."}), 200
        else:
            return jsonify({"message": "Nie znaleziono użytkownika."}), 404

    except Exception as error:
        logging.error(f"Błąd podczas zatwierdzania użytkownika: {error}")
        return jsonify({"message": "Wystąpił błąd podczas zatwierdzania użytkownika."}), 500
        return jsonify({"message": "Wystąpił błąd podczas zatwierdzania użytkownika."}), 500

    finally:
        if cursor:
            cursor.close()
        if db_connector:
            db_connector.disconnect()


def check_user(username, password):
    db_connector = DatabaseConnector()
    db_connector.connect()  # Nawiązanie połączenia

    connection = db_connector.get_connection()
    cursor = connection.cursor()

    try:
        query = "SELECT password, zatwierdzony FROM Users WHERE username = %s"
        values = (username,)

        cursor.execute(query, values)
        result = cursor.fetchone()

        if result:
            db_password, zatwierdzony = result
            db_password = db_password.encode('utf-8')

            if not zatwierdzony:
                return jsonify({"message": "Użytkownik nie został jeszcze zatwierdzony."}), 403

            if bcrypt.checkpw(password.encode('utf-8'), db_password):
                session['username'] = username
                return True

        return False

    except Exception as error:
        logging.error(f"Błąd podczas uwierzytelniania użytkownika: {error}")
        return jsonify({"message": "Wystąpił błąd podczas logowania."}), 500

    finally:
        if cursor:
            cursor.close()
        if db_connector:
            db_connector.disconnect()


def send_new_password_email(email, new_password):
    subject = 'Resetowanie hasła'
    body = f'Twoje nowe hasło to: {new_password}'

    msg = MIMEMultipart()
    msg['From'] = formataddr((str(Header('Icer Poland', 'utf-8')), SMTP_USER))
    msg['To'] = email
    msg['Subject'] = Header(subject, 'utf-8')

    msg.attach(MIMEText(body, 'plain', 'utf-8'))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            # Kodowanie wiadomości w UTF-8
            message_string = msg.as_string().encode('utf-8')
            server.sendmail(SMTP_USER, email, message_string)
    except Exception as e:
        error_message = f'Błąd podczas wysyłania e-maila do {email}: {e}\n{traceback.format_exc()}'
        logging.error(error_message)


def generate_random_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(characters) for _ in range(length))


@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"message": "Adres e-mail jest wymagany"}), 400

    db_connector = DatabaseConnector()
    db_connector.connect()

    connection = db_connector.get_connection()
    cursor = connection.cursor()

    try:
        query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(query, (email,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"message": "Użytkownik o podanym adresie e-mail nie istnieje"}), 404

        user_id = result[0]

        # Generowanie nowego hasła
        new_password = generate_random_password()
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

        # Aktualizacja hasła w bazie danych
        update_query = "UPDATE Users SET password = %s WHERE id = %s"
        cursor.execute(update_query, (hashed_password, user_id))
        connection.commit()

        # Wysłanie nowego hasła e-mailem
        send_new_password_email(email, new_password)

        return jsonify({"message": "Hasło zostało zresetowane i wysłane na Twój adres e-mail"}), 200

    except Exception as e:
        error_message = f'Błąd podczas resetowania hasła {email}: {e}\n{traceback.format_exc()}'
        logging.error(error_message)
        return jsonify({"message": "Wystąpił błąd podczas resetowania hasła"}), 500

    finally:
        if cursor:
            cursor.close()
        if db_connector:
            db_connector.disconnect()


@app.route('/api/edit_user', methods=['POST'])
def edit_user():

    # Sprawdzanie, czy użytkownik jest zalogowany
    if 'username' not in session:
        return jsonify({"error": "Musisz być zalogowany, aby edytować dane."})
    try:
        data = request.json
        new_password = data.get('new_password')
        new_username = data.get('new_username')
        db_connector = DatabaseConnector()
        db_connector.connect()  # Nawiązanie połączenia
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


# Obsluga chatbota (HTML)
@app.route('/', methods=['GET', 'POST'])
def index():
    """
    Obsługuja bota wersja HTML
    """
    # Pusty ciąg znaków dla odpowiedzi chatbota
    bot_response = ""

    if request.method == 'POST':
        # Pobierz dane wejściowe użytkownika z formularza
        user_input = request.form['user_input']
        # Wywołaj funkcję (get_bot_response) by wygenerować odpowiedź.
        bot_response = get_bot_response(user_input)
    # Wygeneruj odpowiedź,renderując'index.html' i przekazując odpowiedź bota.
    response = make_response(render_template('index.html', bot_response=bot_response, ))
    # Ustaw nagłówek Content-Type, aby się upewnić, że odpowiedź jest w formacie HTML i odpowiednim kodowaniu.
    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    # Zwróć wygenerowaną odpowiedź.
    return response


# Pobieranie odpowiedzi na podstawie zapytania
@app.route('/get_response', methods=['POST'])
def get_response():
    """
    Pobieranie odpowiedzi od bota
    """
    # Pobierz dane wejściowe użytkownika z JSON
    user_input = request.json.get('user_input')

    # Sprawdź, użytkownik wysyła prawidłowe dane
    if user_input:
        # Pobierz odpowiedź od bota na podstawie zapytania użytkownika
        response = get_bot_response(user_input)

        # Utwórz JSON z odpowiedzią bota
        response_data = {'response': response}

        # Zwróć odpowiedź
        return jsonify(response_data), 200, {'Content-Type': 'application/json; charset=utf-8'}

    # Jeśli dane wejściowe nie są poprawne zwróć błąd.
    return jsonify({'error': 'Nieprawidłowe dane wejściowe'})


# Generowanie kodu QR
@app.route('/generate_qr_code', methods=['POST'])
def generate_qr_code_route():
    """
    Funkcja obsługująca generowanie kodów QR.
    """
    try:
        # Wyodrębnij dane przesłane z formularza
        data = {
            "name": request.form['name'],
            "price": request.form['price'],
            "kcal": request.form['kcal'],
            "fat": request.form['fat'],
            "carbs": request.form['carbs'],
            "protein": request.form['protein'],
            "category": request.form['category'],
            "amount": request.form['amount'],
            "date": request.form['date']
        }

        # Wygeneruj kod QR
        qr_code_image_filename = generate_qr_code(data, app.config['QR_CODE_FOLDER'])

        # Pobierz URL wygenerowanego obrazu kodu QR w folderze 'static'
        qr_code_image_url = url_for('static', filename='qrcodes/' + qr_code_image_filename)

        # Zakoduj obraz kodu QR w base64, utf-8 by uniknąć błędów
        qr_code_image_path = os.path.join(app.config['QR_CODE_FOLDER'], qr_code_image_filename)
        with open(qr_code_image_path, "rb") as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode('utf-8')

        # Wyświetl komunikat o sukcesie
        flash("Kod QR wygenerowany pomyślnie!")

        # Zwróć odpowiedź JSON z adresem URL kodu QR i zakodowanym obrazem w base64
        response = {
            'status': 'success',
            'qr_code_image_url': qr_code_image_filename,
            'qr_code_image_base64': encoded_image
        }
        return jsonify(response), 200
    except Exception as e:
        # Obsłuż błędy i zwróć odpowiedź JSON z komunikatem błędu
        response = {
            'status': 'error',
            'message': str(e)
        }
        return jsonify(response), 500


# Dekodowanie kodu QR
@app.route('/decode_qr_code', methods=['POST'])
def decode_qr_code_route():
    """
    Dekodowanie informacji z kodu QR
    """
    # Sprawdzenie, czy plik 'qr_code_image' istnieje 
    if 'qr_code_image' not in request.files:
        flash('Plik nie istnieje', 'error')
        return redirect(request.url)

    # Pobranie pliku 
    file = request.files['qr_code_image']

    # Sprawdzenie, czy nie wybrano pliku
    if file.filename == '':
        flash('Nie wybrano pliku', 'error')
        return redirect(request.url)

    # Sprawdzenie, czy wybrany plik ma dozwolone rozszerzenie
    if file and allowed_file(file.filename):
        # Bezpieczne zapisanie przesłanego pliku do folderu
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['QR_CODE_FOLDER'], filename)
        file.save(file_path)

        # Próba odczytu kodu QR 
        decoded_data = decode_qr_code(file_path)

        if decoded_data:
            # Wyświetlenie komunikatu o sukcesie
            flash("Kod QR zdekodowano pomyślnie!", "success")
            return f"Zdekodowanie dane z QR: {decoded_data}"

        else:
            # Wyświetlenie komunikatu o błędzie i przekierowanie z powrotem do strony przesyłania pliku
            flash("Nie udało się zdekodować pliku.", "error")
            return redirect(request.url)

    else:
        # Wyświetlenie komunikatu o błędzie dla niedozwolonego typu pliku.
        flash('Zły typ pliku, prześlij plik obrazu, w dozwolonym formacie.', 'error')
        return redirect(request.url)


# Pobieranie nazwy użytkownika
@app.route('/get_username', methods=['POST'])
def get_username_route():
    # Pobierz nazwę użytkownika z sesji
    username = session.get('username', None)

    # Sprawdź, czy nazwa użytkownika została pobrana poprawnie
    if username is None:
        return jsonify({"error": "Nie znaleziono nazwy użytkownika w sesji"}), 400

    # Wywołaj funkcję przekazującą nazwę użytkownika
    username_forward(username)
    return "Nazwa użytkownika przekazana."


# Przesyłanie nazwy użytkownika
def username_forward(username):
    # skorzystaj z funkcji pomocniczej
    clear_food_username(username)


# Resetowania listy zakupow
@app.route('/reset_food_list', methods=['POST'])
def reset_food_list():
    """
    Resetowanie nazwy użytkownika
    """
    # Pobranie nazwy użytkownika z żądania
    data = request.json
    if not data or 'username' not in data:
        return jsonify({"error": "Nazwa użytkownika wymagana"}), 400

    username = data['username']

    # Wywołanie funkcji do resetowania listy jedzenia
    result = clear_food_username(username)

    # Sprawdzenie, czy funkcja zakończyła się sukcesem 
    if result:
        # Jeśli tak zwracam komunikat sukcesu i kod 200
        return jsonify({"message": f"Lista dla {result} została zresetowana"}), 200
    else:
        # Jeśli nie zwracam komunikat błędu i kod 500
        return jsonify({"error": "Błąd resetowania listy"}), 500


def normalize_key(key):
    """
    Normalizuje klucze w danych z QR kodu do jednolitych kluczy używanych w aplikacji.
    """
    # Mapowanie kluczy na jednorodne klucze
    key_mappings = {
        'Nazwa': 'nazwa',
        'Cena': 'cena',
        'Kalorie': 'kalorie',
        'Tłuszcze': 'tluszcze',
        'Węglowodany': 'weglowodany',
        'Białko': 'bialko',
        'Kategoria': 'kategoria',
        'Ilość': 'ilosc',
        'Data': 'data'
    }
    return key_mappings.get(key, key.lower())  # Domyślnie przekształca na małe litery


@app.route('/adison_molotow', methods=['POST'])
def get_frame():
    """
    Analizuje klatki z video przesłane jako obrazy w formacie base64, przetwarza je, a następnie aktualizuje listę jedzenia dla danego użytkownika.
    """
    # Pobierz dane JSON z żądania
    data = request.json
    if data is None or 'images' not in data or 'username' not in data:
        return jsonify({'error': 'Brak zdjęcia lub nazwy użytkownika '}), 400
    images_data = data['images']
    username = data['username']
    responses = []

    for idx, image_data in enumerate(images_data):
        try:
            # Dekodowanie danych base64 bezpośrednio do bajtów
            image_bytes = base64.b64decode(image_data)
            # Konwersja bajtów do obrazu OpenCV
            image_np = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
            if image is None:
                responses.append({'error': 'Nie udało się załadować obrazu'})
                continue

            # Konwersja obrazu OpenCV do formatu PIL, jeśli funkcje tego wymagają
            image_pil = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
            # Przetwarzanie obrazu, np. dekodowanie kodu QR
            decoded_data = decode_qr_code_frames(image_pil)
            if decoded_data and decoded_data != "Kod QR nie został wykryty":
                # Normalizacja kluczy w decoded_data
                normalized_data = {normalize_key(key): value for key, value in decoded_data.items()}
                # Aktualizacja z domyślnymi wartościami
                normalized_data.update({
                    "cena": float(normalized_data.get("cena", 0)),
                    "kalorie": int(normalized_data.get("kalorie", 0)),
                    "tluszcze": float(normalized_data.get("tluszcze", 0)),
                    "weglowodany": float(normalized_data.get("weglowodany", 0)),
                    "bialko": float(normalized_data.get("bialko", 0)),
                    "ilosc": int(normalized_data.get("ilosc", 0)),
                    "kategoria": normalized_data.get("kategoria", "brak")
                })
                responses.append(normalized_data)
            else:
                pred_class = predict_and_update_food_list(image_pil, username)
                updated_food_list = update_food_list([pred_class])
                responses.extend(updated_food_list)

        except Exception as e:
            responses.append({'error': str(e)})
    logging.info(f'odpowiedz: {responses}  ')
    return jsonify(responses), 200


@app.route('/upload_test_AI_QR', methods=['GET', 'POST'])
def upload_predictor():
    """
    Obsługuje przesyłanie plików przez użytkowników, identyfikuje QR kody i klasyfikuje jedzenie przy użyciu AI.
    """
    try:
        print("Endpoint wywołany: ", request.method)  # Logowanie metody żądania
        db_connector = DatabaseConnector()
        db_connector.connect()  # Nawiązanie połączenia

        connection = db_connector.get_connection()
        if not connection:
            raise ConnectionError("Nie udało się nawiązać połączenia z bazą danych.")
        cursor = connection.cursor(dictionary=True)

        if request.method == 'POST':
            # Sprawdzenie, czy w żądaniu znajdują się plik i nazwa użytkownika
            if 'file' not in request.files or 'username' not in request.form:
                flash('Brak części pliku lub nazwy użytkownika', 'error')
                return jsonify({"status": "error", "message": "Brak części pliku lub nazwy użytkownika"})

            file = request.files['file']
            username = request.form['username']
            # Sprawdzenie, czy plik został wybrany
            if file.filename == '':
                flash('Nie wybrano pliku', 'error')
                return jsonify({"status": "error", "message": "Nie wybrano pliku"})

            # Sprawdzenie, czy plik ma dozwolone rozszerzenie
            if file and allowed_file(file.filename):
                # Zapisanie pliku na serwerze
                filename = secure_filename(file.filename)
                upload_folder = 'static/uploads/'
                file_path = os.path.join(upload_folder, filename)
                file.save(file_path)
                # Próba odczytu kodu QR
                decoded_data = decode_qr_code(file_path)
                if decoded_data and decoded_data != "Kod QR nie został wykryty":
                    # Normalizacja kluczy oraz wartości w danych z QR kodu
                    normalized_data = {normalize_key(key): value for key, value in decoded_data.items()}
                    normalized_data.update({
                        "cena": float(normalized_data.get("cena", 0)),
                        "kalorie": int(normalized_data.get("kalorie", 0)),
                        "tluszcze": float(normalized_data.get("tluszcze", 0)),
                        "weglowodany": float(normalized_data.get("weglowodany", 0)),
                        "bialko": float(normalized_data.get("bialko", 0)),
                        "ilosc": int(normalized_data.get("ilosc", 0)),
                        "kategoria": normalized_data.get("kategoria", "brak")
                    })

                    # Zwróć dane z QR kodu bez aktualizacji listy jedzenia
                    return jsonify({"status": "success", "type": "qr", "data": normalized_data})

                else:
                    # Informacja o braku kodu QR i przejście do predykcji jedzenia
                    logging.info("Nie wykryto kodu QR, przechodzę do klasyfikacji jedzenia.")

                # Dokonanie predykcji na podstawie przesłanego obrazu
                pred_class = pred_and_plot(model, file_path, class_names, username)
                if pred_class:
                    # Aktualizacja listy jedzenia na podstawie wyniku predykcji
                    updated_food_list = update_food_list([pred_class])
                    return jsonify({"status": "success", "type": "food", "data": updated_food_list})
                else:
                    return jsonify({"status": "error", "message": "Nie wykryto kodu QR i jedzenia."})
            else:
                return jsonify({"status": "error", "message": "Zły typ pliku, prześlij poprawny"})

        # Obsługa żądania innego niż POST
        return jsonify({"status": "error", "message": "Wysłano zapytanie POST z obrazem"})

    # Obsługa wyjątków i błędów
    except Exception as e:
        logging.info(f"An error occurred: {e}")
        return jsonify({"status": "error", "message": "Błąd wewnętrzny serwera."})



# Analiza klatek reklama + podawanie statusu dla odtwarzana video
@app.route('/advert_reciever', methods=['POST'])
def advert_reciever():
    """
    Obsługuje analizę klatek dla inteligentej reklamy i status video
    """
    # Sprawdzenie, czy dane są przekazywane w formacie JSON
    if not request.is_json:
        return jsonify({"error": "Zły typ pliku, użyj JSON"}), 400
    data = request.get_json()
    # Sprawdzenie, czy obraz jest w danych JSON
    if 'image' not in data:
        return jsonify({"error": "Brak danych obrazu"}), 400
    image_data = data['image']
    # Usunięcie prefiksu data:image/png;base64, jeśli istnieje
    if image_data.startswith('data:image'):
        image_data = image_data.split(',')[1]
    try:
        # Dekodowanie danych base64
        image_bytes = base64.b64decode(image_data)
        # Konwersja bajtów na obraz OpenCV
        image_np = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
        if image is None:
            return jsonify({"error": "Nie udało się załadować obrazu"}), 500

        # Wykrywanie twarzy i oczu
        detected_faces, detected_eyes = detect_faces_and_eyes(image)
        # Aktualizacja stanu wideo
        if video_state["video_choice"] == 1:
            if len(detected_faces) > 0 and len(detected_eyes) > 0:
                video_state["playing"] = True
            else:
                video_state["playing"] = False
        # Przygotowanie odpowiedzi
        response = {
            "faces_detected": len(detected_faces),
            "eyes_detected": len(detected_eyes),
            "faces": detected_faces.tolist() if isinstance(detected_faces, np.ndarray) else detected_faces,
            "eyes": detected_eyes.tolist() if isinstance(detected_eyes, np.ndarray) else detected_eyes,
            "video_playing": video_state["playing"]
        }
        # Zwracanie odpowiedzi
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Startowanie video
@app.route('/start_video', methods=['POST'])
def start_video():
    """
    Rozpoczyna odtwarzanie wybranego wideo na podstawie przesłanego wyboru użytkownika.
    """
    # Sprawdzanie poprawnosci formatu przesłanych danych
    if not request.is_json:
        return jsonify({"error": "Zły typ pliku, oczekiwano JSON"}), 400

    # Pobierz dane JSON z żądania
    data = request.get_json()
    video_choice = data.get('video_choice')
    # Sprawdź, czy 'video_choice' ma wlaściwą wartość i nie jest None
    if video_choice is None or video_choice not in [0, 1]:
        return jsonify({"error": "Zły wybór, podaj 1 lub 2"}), 400

    # Wybierz plik wideo na podstawie przesłanej wartośći
    video_file = 'videoplayback.mp4' if video_choice == 1 else 'videoplaybackalt.mp4'

    try:
        # Aktualizacja stanu video
        video_state["video_choice"] = video_choice
        video_state["playing"] = True
        # Generuj URL do wybranego wideo
        video_url = f'/video/{video_file}'
        # Zwróć odpowiedź JSON z URL wideo i informacją o sukcesie
        return jsonify({"video_url": video_url, "message": "Rozpoczynam odtwarzanie wideo"}), 200
    # Jeśli nie znaleziono pliku zwróć błąd

    except FileNotFoundError:
        return jsonify({"error": "Nie znaleziono pliku"}), 404


# Pomocnicza do lokalizacji video
@app.route('/video/<filename>', methods=['GET'])
def serve_video(filename):
    try:
        return send_from_directory(video_dir, filename, as_attachment=False)
    except FileNotFoundError:
        return jsonify({"error": "Nie znaleziono pliku"}), 404


# Do sterowania video
@app.route('/control_video', methods=['POST'])
def control_video():
    if not request.is_json:
        return jsonify({"error": "Zły typ pliku, podaj w JSON"}), 400

    data = request.get_json()
    action = data.get('action')
    # Obsługa niewłaściwej akcji
    if action not in ['play', 'pause']:
        return jsonify({"error": "Zła akcja. Podaj 'play' lub 'pause'"}), 400
    # Aktualizacja na podstawie akcji
    video_state["playing"] = (action == 'play')

    return jsonify({"message": f"Video jest {action}ed", "video_playing": video_state["playing"]}), 200


# Stripe -------------------------------------------------------

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')


@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        data = request.json
        username = data.get('username', 'unknown_user')
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'Premium Account',
                    },
                    'unit_amount': 500,  # Cena w centach (500 centów = 5 dolarów)
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='https://icer.net.pl:443/loading?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='https://icer.net.pl:443/loading?session_id={CHECKOUT_SESSION_ID}',
            metadata={
                'username': username
            }
        )
        return jsonify(session_id=session.id)
    except Exception as e:
        return jsonify(error=str(e)), 400


@app.route('/success')
def success():
    session_id = request.args.get('session_id')
    print(f"Received session_id: {session_id}")  # Logowanie session_id
    if session_id:
        checkout_session = stripe.checkout.Session.retrieve(session_id)
        if checkout_session.payment_status == 'paid':
            # Pobierz nazwę użytkownika z metadanych sesji
            username = checkout_session['metadata']['username']
            # Połącz się z bazą danych
            db_connector = DatabaseConnector()
            db_connector.connect()

            connection = db_connector.get_connection()
            cursor = connection.cursor()

            try:
                # Sprawdzenie, czy użytkownik jest zalogowany
                user_id, username, response, status_code = db_connector.get_user_id_by_username(cursor, session)

                if status_code != 200:
                    return jsonify(message="Użytkownik nie jest zalogowany."), 401
                # Ustaw uzytkownik_premium na 1 (data_koniec_premium jest aktualizowana automatycznie przez trigger)
                query_update = """
                    UPDATE preferencje_uzytkownikow 
                    SET uzytkownik_premium = %s
                    WHERE UserID = %s
                """
                cursor.execute(query_update, (1, user_id))
                connection.commit()
                return jsonify(
                    message="Payment succeeded!",
                    session_id=session_id,
                    customer=checkout_session['customer'],
                    username=username,
                    status="premium"
                )

            except Exception as e:
                print(f"Błąd podczas aktualizacji statusu użytkownika: {e}")
                return jsonify(message="Wystąpił błąd podczas aktualizacji statusu użytkownika."), 500

            finally:
                if cursor:
                    cursor.close()
                if db_connector:
                    db_connector.disconnect()
        else:
            return jsonify(message="Payment not completed successfully."), 400
    else:
        return jsonify(message="Payment succeeded, but session ID is missing."), 400


@app.route('/cancel')
def cancel():
    return jsonify(message="Payment canceled")


@app.route('/payment-status/<session_id>', methods=['GET'])
def payment_status(session_id):
    try:
        checkout_session = stripe.checkout.Session.retrieve(session_id)
        return jsonify({
            'payment_status': checkout_session.payment_status,
            'customer': checkout_session['customer'],
            'username': checkout_session['metadata']['username'],
        })
    except Exception as e:
        return jsonify(error=str(e)), 400


@app.route('/success_placeholder')
def success_placeholder():
    return jsonify(message="Payment processing...")

@app.route('/cancel_placeholder')
def cancel_placeholder():
    return jsonify(message="Payment was canceled.")


@app.route('/payment-status-checker', methods=['GET'])
def payment_status_checker():
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({'error': 'session_id is required'}), 400

    try:
        checkout_session = stripe.checkout.Session.retrieve(session_id)
        payment_status = checkout_session.payment_status

        if payment_status == 'paid':
            # Pobierz nazwę użytkownika z metadanych sesji
            username = checkout_session['metadata']['username']

            # Połącz z bazą danych
            db_connector = DatabaseConnector()
            db_connector.connect()

            connection = db_connector.get_connection()
            cursor = connection.cursor()

            try:
                # Pobierz user_id na podstawie username
                user_id_query = "SELECT id FROM Users WHERE username = %s"
                cursor.execute(user_id_query, (username,))
                user_id_result = cursor.fetchone()

                if not user_id_result:
                    return jsonify({"message": "Użytkownik nie został znaleziony."}), 404

                user_id = user_id_result[0]

                # Aktualizuj status premium w tabeli preferencje_uzytkownikow
                update_query = """
                UPDATE preferencje_uzytkownikow
                SET uzytkownik_premium = 1
                WHERE UserID = %s
                """
                cursor.execute(update_query, (user_id,))
                connection.commit()

            except Exception as e:
                return jsonify({'error': f"Błąd podczas aktualizacji bazy danych: {str(e)}"}), 500

            finally:
                if cursor:
                    cursor.close()
                if db_connector:
                    db_connector.disconnect()

            return jsonify({
                'status': 'success',
                'message': 'Payment succeeded!',
                'username': username
            })

        return jsonify({'status': payment_status}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



# Strona wylogowania
@app.route('/logout')
def logout():
    # Usunięcie sesji
    session.pop('username', None)
    return redirect('/login')


# Ladowanie wstepne modeli do video
if __name__ == '__main__':
    # Preładowanie modeli do rozpoznawania z video
    preload()
    preload_haar()
    app.run()
