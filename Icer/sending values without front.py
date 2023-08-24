import requests

url = "http://localhost:5000/api/add_product"
data = {
    "nazwa": "Testowy Chuj",
    "cena": 10.50,
    "kalorie": 100,
    "bialko": 2.5,
    "tluszcze": 1.5,
    "weglowodany": 20,
    "kategoria": "Napoje",
    "ilosc": 5,
    "data_waznosci": "2023-08-25"
}

response = requests.post(url, json=data)

print(response.text)

url2 = "http://localhost:5000/api/subtract_product"

data = {
    "id_produktu": 11,  # Przykładowe ID produktu, który chcesz zaktualizować
    "ilosc_do_odejscia": 1  # Ilość do odjęcia od aktualnej ilości produktu w bazie danych
}

#response = requests.post(url2, json=data)

#print(response.text)




# Edycja danych użytkownika
url3 = "http://localhost:5000/api/edit_user"

data3 = {
    "new_password": "NoweHaslo123",   # Przykładowe nowe hasło
    "new_username": "NowaNazwaUzytkownika"  # Przykładowa nowa nazwa użytkownika
}

#response3 = requests.post(url3, json=data3)
#print(response3.text)