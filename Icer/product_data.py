import mysql


class ProductData:
    def __init__(self, connection):
        self.connection = connection

    def fetch_products(self):
        query = "SELECT * FROM Produkty"

        try:
            cursor = self.connection.cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            cursor.close()
            return results
        except mysql.connector.Error as error:
            print("Błąd podczas pobierania danych: ", error)

    def display_products(self, products):
        for row in products:
            print("Nazwa: ", row[1])
            print("Cena: ", row[2])
            print("Kalorie: ", row[3])
            print("Tłuszcze: ", row[4])
            print("Węglowodany: ", row[5])
            print("Białko: ", row[6])
            print("Kategoria: ", row[7])
            print("Ilość: ", row[8])
            print("-----------------------")