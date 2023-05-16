# Importowanie klas
import value_manager
from database_connector import DatabaseConnector
from product_data import ProductData

# Tworzenie instancji klasy DatabaseConnector
db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")

# Łączenie z bazą danych
db_connector.connect()

# Pobieranie połączenia z bazą danych
connection = db_connector.get_connection()

# Tworzenie instancji klasy ProductData
product_data = ProductData(connection)

# Pobieranie danych produktów
products = product_data.fetch_products()

# Wyświetlanie danych produktów
##product_data.display_products(products)

# Dodawanie produktu

product_manager = value_manager.ProductManager(db_connector)  # Tworzenie instancji klasy ProductManager
product_manager.dodaj_produkt("Kokos", 2.5, 52, 0.2, 13.8, 0.3, "Owoce", 10)



# Wyświetlanie danych produktów
product_data.display_products(products)

# Odejmowanie produktu
product_manager.odejmij_produkt(7, 1)


# Wyświetlanie danych produktów
##product_data.display_products(products)


# Rozłączanie z bazą danych
db_connector.disconnect()