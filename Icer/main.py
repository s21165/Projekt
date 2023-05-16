# Importowanie klas
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
product_data.display_products(products)

# Rozłączanie z bazą danych
db_connector.disconnect()