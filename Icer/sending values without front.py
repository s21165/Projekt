import requests

url = "http://localhost:5000/api/add_to_product"  # Zmienić adres jeśli serwer działa na innym porcie lub hostie

headers = {
    "Content-Type": "application/json",
}

data = {
    "sessionId": "70f854fd-b33f-430c-ac13-ac764828f189",
    "id_produktu": 123,
    "ilosc_do_dodania": 2
}

response = requests.post(url, headers=headers, json=data)

print(response.status_code)
print(response.json())

url = "http://localhost:5000/api/add_product"

products = [
    {
        "nazwa": "Mleko",
        "cena": 2.50,
        "kalorie": 42,
        "bialko": 3.4,
        "tluszcze": 1.2,
        "weglowodany": 5.0,
        "kategoria": "Napoje",
        "ilosc": 5,
        "data_waznosci": "2023-08-25"
    },
    {
        "nazwa": "Jajko",
        "cena": 0.50,
        "kalorie": 68,
        "bialko": 5.5,
        "tluszcze": 4.8,
        "weglowodany": 0.6,
        "kategoria": "Nabiał",
        "ilosc": 10,
        "data_waznosci": "2023-09-10"
    },
    # ... dodaj kolejne produkty
    {
        "nazwa": "Chleb",
        "cena": 2.80,
        "kalorie": 265,
        "bialko": 8.2,
        "tluszcze": 1.1,
        "weglowodany": 48.0,
        "kategoria": "Pieczywo",
        "ilosc": 3,
        "data_waznosci": "2023-08-27"
    },
    {
        "nazwa": "Szynka",
        "cena": 12.00,
        "kalorie": 250,
        "bialko": 22.0,
        "tluszcze": 18.0,
        "weglowodany": 0.5,
        "kategoria": "Mięso",
        "ilosc": 2,
        "data_waznosci": "2023-09-02"
    },
    {
        "nazwa": "Pomidor",
        "cena": 1.20,
        "kalorie": 22,
        "bialko": 0.9,
        "tluszcze": 0.2,
        "weglowodany": 4.7,
        "kategoria": "Warzywa",
        "ilosc": 7,
        "data_waznosci": "2023-09-15"
    }

    # ... dodaj kolejne produkty do osiągnięcia 10 produktów
]

#for product in products:
#    response = requests.post(url, json=product)
#    print(f"Response for {product['nazwa']}: {response.text}")

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


