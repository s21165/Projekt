# Zaimportuj wszystkie potrzebne moduły
import uuid
import bcrypt
import requests
import logging
from dotenv import load_dotenv
from flask import Flask, request, jsonify, session, redirect
from flask_cors import CORS
from jsonschema._validators import const
from node_modules.database_connector import DatabaseConnector
from modules.product_data import ProductData
from modules.value_manager import ProductManager
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_talisman import Talisman
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from flask import Flask, request, jsonify, session, redirect
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

USE_TEST_SESSION = True  # Jeśli ustawione na True, korzystaj z sesji testowej
TEST_SESSION = {
    'username': 'test_user',
    'session_id': 'test_session_id'
}


app = Flask(__name__)
# Tworzenie instancji klasy DatabaseConnector i łączenie z bazą danych
db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")
db_connector.connect()

# Tworzenie instancji ProductManager
product_manager = ProductManager(db_connector)
# Inicjalizacja aplikacji Flask




CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Konfiguracja klucza sesji
app.secret_key = uuid.uuid4().hex

# Konfiguracja Flask-Session
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_KEY_PREFIX'] = 'shopping_app_'
app.config['SESSION_FILE_DIR'] = './.flask_session/'
Session(app)

# Konfiguracja bazy danych SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@localhost:5432/mydatabase'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Konfiguracja logowania
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Konfiguracja Flask-Talisman dla HTTPS
talisman_config = {
    'session_cookie_secure': False,  # Dla celów deweloperskich. Ustaw na True w środowisku produkcyjnym
}
talisman = Talisman(app, **talisman_config)



app.config['SECRET_KEY'] = 'moj_tajny_klucz'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'




class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(username=data['username'], password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201

## funkcje wykorzystywane do rejestracji
def user_exists(username):
    query = "SELECT * FROM Users WHERE username = %s"
    values = (username,)
    cursor = db_connector.get_connection().cursor()
    cursor.execute(query, values)
    result = cursor.fetchone()
    cursor.close()

    return True if result else False

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()

        # Jeśli korzystamy z sesji testowej
        if USE_TEST_SESSION:
            session['username'] = TEST_SESSION['username']
            session['session_id'] = TEST_SESSION['session_id']
            return jsonify({"message": "Login successful (test session)", "session_id": TEST_SESSION['session_id']})

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"message": "Username or password not provided"}), 400

        def check_user(username, password):
            try:
                # Pobierz użytkownika o podanej nazwie użytkownika
                user = User.query.filter_by(username=username).first()
                if not user:
                    return False

                # Porównaj podane hasło z hasłem w bazie danych
                if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                    return True
                else:
                    return False
            except Exception as e:
                logger.error(f"Error checking user: {str(e)}")
                return False


def check_user(username, password):
    try:
        # Pobierz użytkownika o podanej nazwie użytkownika
        user = User.query.filter_by(username=username).first()
        if not user:
            return False

        # Porównaj podane hasło z hasłem w bazie danych
        if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return True
        else:
            return False
    except Exception as e:
        logger.error(f"Error checking user: {str(e)}")
        return False


@app.errorhandler(404)
def handle_404(error):
    return jsonify({"error": "Not found"}), 404


@app.errorhandler(405)
def handle_405(error):
    return jsonify({"error": "Method not allowed"}), 405


@app.errorhandler(500)
def handle_500(error):
    logger.error(f"Internal error: {str(error)}")
    return jsonify({"error": "Internal Server Error"}), 500


if __name__ == '__main__':
    app.run(debug=True)


def is_user_logged_in(session_id):
    return 'username' in session and session.get('session_id') == session_id


@app.route('/api/add_product', methods=['POST'])
def add_product():
    print("dziala?")
    print("Session data:", session)

    # Pobranie sessionId z nagłówków żądania
    session_id = request.headers.get('session_id')

    if not is_user_logged_in(session_id):
        return jsonify({"error": "User not logged in or invalid session ID"}), 401

    db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")
    db_connector.connect()
    product_manager = ProductManager(db_connector)

    connection = None
    cursor = None
    try:
        connection = db_connector.get_connection()
        cursor = connection.cursor(dictionary=True)

        username = session['username']

        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()

        if not user_result:
            return jsonify({"error": "User not found"}), 404

        data = request.json
        user_id = user_result['id']

        check_product_query = "SELECT id FROM Produkty WHERE nazwa = %s AND cena = %s"
        cursor.execute(check_product_query, (data['nazwa'], data['cena']))
        product_exists = cursor.fetchone()

        if product_exists:
            product_id = product_exists['id']
        else:
            product_id = product_manager.dodaj_produkt(
                data['nazwa'], data['cena'], data['kalorie'],
                data['tluszcze'], data['weglowodany'],
                data['bialko'], data['kategoria']
            )

            if product_id is None:
                return jsonify({"error": "Failed to add product to Produkty table."}), 500

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
    # Najpierw sprawdzamy session_id w nagłówkach
    session_id_header = request.headers.get('session_id')

    if 'sessionId' not in session or session['sessionId'] != session_id_header:
        return jsonify({"error": "Invalid session ID"}), 401

    connection = db_connector.get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        if 'username' not in session:
            return jsonify({"error": "User not logged in"}), 419

        # Pobranie ID aktualnie zalogowanego użytkownika
        username = session['username']
        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()

        if not user_result:
            return jsonify({"error": "User not found"}), 401

        # Modyfikacja zapytania SQL
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


@app.route('/logout', methods=['GET'])
def logout():
    session.pop('username', None)
    return redirect('/login')


if __name__ == "__main__":
    app.run(debug=True)
