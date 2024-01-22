class ProductManager:

    def dodaj_jednostke_produktu(self, id_produktu, user_id):
        self.__modify_product_quantity(id_produktu, user_id, 'add')

    def odejmij_jednostke_produktu(self, id_produktu, user_id):
        self.__modify_product_quantity(id_produktu, user_id, 'subtract')

    def zeruj_ilosc_produktu(self, id_produktu, user_id):
        self.__modify_product_quantity(id_produktu, user_id, 'zero')

    def usun_produkt(self, id_produktu, user_id):
        self.__modify_product_quantity(id_produktu, user_id, 'remove')

    def __modify_product_quantity(self, id_produktu, user_id, action):
        try:
            connection = self.db_connector.get_connection()

            with connection.cursor() as cursor:
                # Wypisanie wywołania procedury przed jej wykonaniem
                print(f"CALL ModifyProductQuantity({id_produktu}, {user_id}, '{action}');")

                cursor.callproc('ModifyProductQuantity', (id_produktu, user_id, action))
                connection.commit()
                print(f"Ilość produktu została zaktualizowana ({action}).")

        except Exception as error:
            print(f"Błąd podczas {action} jednostki produktu w bazie danych: ", error)

    def __init__(self, database_connector):
        self.db_connector = database_connector

    def dodaj_produkt(self, nazwa, cena, kalorie=None, tluszcze=None, weglowodany=None, bialko=None, kategoria=None):
        try:
            connection = self.db_connector.get_connection()
            cursor = connection.cursor()

            query = "INSERT INTO Produkty (nazwa, cena, kalorie, tluszcze, weglowodany, bialko, kategoria) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            values = (nazwa, cena, kalorie, tluszcze, weglowodany, bialko, kategoria)

            with connection.cursor() as cursor:
                cursor.execute(query, values)
                connection.commit()

                return cursor.lastrowid  # Zwraca ID dodanego produktu

        except Exception as error:
            print("Błąd podczas dodawania produktu do bazy danych: ", error)
            return None

    def odejmij_produkt(self, id_produktu, ilosc_do_odejscia):
        try:
            connection = self.db_connector.get_connection()
            cursor = connection.cursor()

            query = "SELECT ilosc FROM Produkty WHERE id = %s"
            value = (id_produktu,)

            cursor.execute(query, value)

            current_quantity = cursor.fetchone()[0]

            new_quantity = current_quantity - ilosc_do_odejscia

            if new_quantity >= 0:
                update_query = "UPDATE Produkty SET ilosc = %s WHERE id = %s"
                update_values = (new_quantity, id_produktu)

                cursor.execute(update_query, update_values)

                connection.commit()

                print("Ilość produktu została zaktualizowana.")
            else:
                print("Nie można odjąć większej ilości produktu niż aktualnie dostępnej")
        except Exception as error:
            print("Błąd podczas odejmowania produktu z bazy danych: ", error)
