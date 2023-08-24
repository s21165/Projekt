import mysql.connector


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
            print("Połączono z bazą danych!")
        except mysql.connector.Error as error:
            print("Błąd połączenia z bazą danych: ", error)

    def update_product(self, product_id, data):
        query = """UPDATE Produkty SET 
                       nazwa=%s, 
                       cena=%s,
                       kalorie=%s,
                       tluszcze=%s, 
                       weglowodany=%s, 
                       bialko=%s, 
                       kategoria=%s, 
                       ilosc=%s,
                       data_waznosci=%s
                      WHERE id=%s"""

        cursor = self.connection.cursor()
        cursor.execute(query, (data['nazwa'], data['cena'], data['kalorie'], data['tluszcze'],
                               data['weglowodany'], data['bialko'], data['kategoria'],
                               data['ilosc'], data['data_waznosci'], product_id))
        self.connection.commit()
        cursor.close()

    def disconnect(self):
        if self.connection:
            self.connection.close()
            print("Rozłączono z bazą danych.")

    def get_connection(self):
        return self.connection
