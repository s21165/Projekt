import mysql.connector
from flask import session, jsonify

class DatabaseConnector:
    def __init__(self, host, user, password, database):
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.connection = None

    def connect(self):
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.user,
                password=self.password,
                database=self.database
            )
            # print("Połączono z bazą danych!")
        except mysql.connector.Error as error:
            print("Błąd połączenia z bazą danych: ", error)

    def update_product(self, product_id, data, user_id):
        try:
            # Zaktualizuj Produkt
            update_produkt_query = """UPDATE Produkty SET 
                                       nazwa=%s, 
                                       cena=%s,
                                       kalorie=%s,
                                       tluszcze=%s, 
                                       weglowodany=%s, 
                                       bialko=%s, 
                                       kategoria=%s
                                    WHERE id=%s"""

            cursor = self.connection.cursor()
            cursor.execute(update_produkt_query, (data['nazwa'], data['cena'], data['kalorie'], data['tluszcze'],
                                                  data['weglowodany'], data['bialko'], data['kategoria'], product_id))
            self.connection.commit()

            # Zaktualizuj ilość w tabeli 'Icer'
            update_icer_query = """UPDATE Icer SET 
                                      ilosc=%s
                                    WHERE produktID=%s AND UserID=%s"""

            cursor.execute(update_icer_query, (data['ilosc'], product_id, user_id))
            self.connection.commit()

            cursor.close()

        except Exception as error:
            raise error

    def disconnect(self):
        if self.connection:
            self.connection.close()
            print("Rozłączono z bazą danych.")

    def get_connection(self):
        return self.connection

    @staticmethod
    def get_user_id_by_username( cursor, session):
        # Sprawdzenie, czy użytkownik jest zalogowany
        if 'username' not in session:
            return None, None, jsonify({"error": "User not logged in"}), 401

        username = session['username']

        # Pobranie ID użytkownika na podstawie nazwy użytkownika
        user_query = "SELECT id FROM Users WHERE username = %s"
        cursor.execute(user_query, (username,))
        user_result = cursor.fetchone()

        if not user_result:
            return None, None, jsonify({"error": "User not found"}), 401

        user_id = user_result['id']
        return user_id, username, None, None