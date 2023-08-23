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
        query = """UPDATE products SET 
                       nazwa=%s, 
                       cena=%s, 
                       bialko=%s, 
                       tluszcze=%s, 
                       weglowodany=%s, 
                       blonnik=%s, 
                       kategoria=%s, 
                       ilosc=%s 
                      WHERE id=%s"""

        self.cursor.execute(query, (data['nazwa'], data['cena'], data['bialko'], data['tluszcze'],
                                    data['weglowodany'], data['blonnik'], data['kategoria'],
                                    data['ilosc'], product_id))
        self.connection.commit()

    def disconnect(self):
        if self.connection:
            self.connection.close()
            print("Rozłączono z bazą danych.")

    def get_connection(self):
        return self.connection
