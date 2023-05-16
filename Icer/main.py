import mysql.connector


# Ustanowienie połączenia z bazą danych
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="Sklep"
)

# Utworzenie kursora
cursor = mydb.cursor()

# Zapytanie SQL do pobrania danych z tabeli 'Produkty'
query = "SELECT * FROM Produkty"

# Wykonanie zapytania
cursor.execute(query)

# Pobranie wszystkich wyników zapytania
results = cursor.fetchall()

# Wyświetlenie danych
for row in results:
    print("Nazwa: ", row[1])
    print("Cena: ", row[2])
    print("Kalorie: ", row[3])
    print("Tłuszcze: ", row[4])
    print("Węglowodany: ", row[5])
    print("Białko: ", row[6])
    print("Kategoria: ", row[7])
    print("Ilość: ", row[8])
    print("-----------------------")

# Zamknięcie kursora i połączenia z bazą danych
cursor.close()
mydb.close()