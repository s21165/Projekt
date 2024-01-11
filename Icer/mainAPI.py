import os

from flask import Flask, request, jsonify, session, redirect, current_app
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import bcrypt
from apscheduler.schedulers.background import BackgroundScheduler
import base64
from json import JSONEncoder

from modules import value_manager
from node_modules.database_connector import DatabaseConnector
from modules.product_data import ProductData
from datetime import datetime, timedelta

from modules.value_manager import ProductManager
import time

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = 'secret_key'  # Klucz sesji

# Ładuj zmienne środowiskowe z pliku .env
load_dotenv()

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

        # Tworzenie instancji ProductManager
        product_manager = ProductManager(db_connector)

        # Pobieranie danych z żądania
        data = request.json
        image_data = data.get('imageData')

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

        # Jeśli podano dane zdjęcia, dodaj je do UserPhotos
        if image_data:
            # Pobierz ostatnie ID z tabeli UserPhotos
            last_user_photo_id = product_manager.get_last_user_photo_id()
            photo_id = last_user_photo_id + 1 if last_user_photo_id else 1

            # Utwórz nazwę zdjęcia jako ID z tabeli UserPhotos
            image_upload_data = {
                "imageName": str(photo_id),  # Nowa nazwa zdjęcia to ID z tabeli UserPhotos
                "imageData": image_data,
                "userId": user_id,
                "productId": product_id
            }

            # Wysłanie żądania do lokalnego endpointu '/api/Icer/upload_image'
            response = requests.post("/api/Icer/upload_image", json=image_upload_data)

            if response.status_code != 200:
                return jsonify({"error": "Failed to upload image"}), response.status_code

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
                    WHERE Icer.UserID = %s AND Icer.trzecia_wartosc <= 2 OR Icer.powiadomienie = 1
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
            WHERE Icer.UserID = %s AND Icer.trzecia_wartosc = 1
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
        image_data = data.get('imageData')  # Zakładając, że obraz jest przesłany jako ciąg bajtów
        user_id = data.get('userId')
        product_id = data.get('productId')

        if not image_name or not image_data or not user_id or not product_id:
            raise ValueError("Missing required data for image upload")

        # Tutaj można ustawić lokalizację folderu, gdzie mają być zapisane obrazy
        images_folder = 'D:/Pobrrane/projekty Adika/Projekt-PWAAdi/icer/src/data/noImage'

        # Tworzenie ścieżki do zapisu obrazu
        image_path = os.path.join(images_folder, image_name)

        # Zapis obrazu na serwerze
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


@app.route('/api/Icer/delete_user_notifications', methods=['POST'])
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

        notification_value = data.get('notificationValue')
        if notification_value in [0, 1, None]:
            # Usunięcie powiadomień danego użytkownika lub zmiana wartości na NULL, 1 lub 0
            delete_notifications_query = "UPDATE Icer SET powiadomienie = %s WHERE UserID = %s"
            cursor.execute(delete_notifications_query, (notification_value, user_id))
            connection.commit()
            return jsonify({"message": "User notifications updated successfully"})

        else:
            return jsonify({"error": "Invalid notification value. It should be 1, 0, or null."}), 400

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


@app.route('/api/Icer/delete_notification', methods=['DELETE'])
def delete_user_notifications():
    try:
        # Tworzenie instancji klasy DatabaseConnector
        db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")

        # Łączenie z bazą danych
        db_connector.connect()

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

        # Pobranie ID użytkownika z bazy danych na podstawie nazwy użytkownika
        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)
        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()

        if not user_result:
            raise LookupError("User not found")

        user_id = user_result['id']

        # Ustawienie wartości powiadomienia na NULL dla wszystkich wpisów użytkownika
        delete_notification_query = "UPDATE ICER SET Powiadomienia = NULL WHERE UserID = %s"
        cursor.execute(delete_notification_query, (user_id,))
        connection.commit()

        return jsonify({"message": "All notifications deleted successfully"})

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


# Strona wylogowania
@app.route('/logout')
def logout():
    # Usunięcie sesji
    session.pop('username', None)
    return redirect('/login')


if __name__ == '__main__':
    app.run()
