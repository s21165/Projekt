# image_handler.py

import os
import base64
from flask import jsonify

import time

from flask import jsonify

from flask import jsonify


def handle_image_upload(db_connector, image_data_base64, user_id, product_id, replace_existing=False):
    try:
        # Odkodowanie danych obrazu z Base64
        image_data = base64.b64decode(image_data_base64.split(",")[1])

        # Aktualny timestamp jako unikalna nazwa pliku
        image_name = f"{int(time.time())}.jpg"

        # Nowa lokalizacja folderu, gdzie mają być zapisane obrazy
        images_folder = 'D:\\repo_na_test\\Projekt-PWAAdi\\icer\\src\\data\\userPhotos'

        # Tworzenie ścieżki do zapisu obrazu
        image_path = os.path.join(images_folder, image_name)

        # Zapis odkodowanego obrazu na serwerze
        with open(image_path, 'wb') as image_file:
            image_file.write(image_data)

        # Uzyskanie połączenia z bazą danych
        connection = db_connector.get_connection()
        cursor = connection.cursor()

        # Jeśli replace_existing jest ustawione na True, to usuń aktualne zdjęcie produktu
        if replace_existing:
            delete_query = "DELETE FROM UserPhotos WHERE produktID = %s AND userID = %s"
            cursor.execute(delete_query, (product_id, user_id))
            connection.commit()

        # Zapis informacji o zdjęciu do bazy danych w tabeli UserPhotos
        insert_query = "INSERT INTO UserPhotos (produktID, userID, lokalizacja_zdj) VALUES (%s, %s, %s)"
        cursor.execute(insert_query, (product_id, user_id, image_name))
        connection.commit()

        # Aktualizacja flagi default_photo w tabeli Icer dla konkretnego produktu użytkownika na 0
        update_query = "UPDATE Icer SET default_photo = 0 WHERE UserID = %s AND produktID = %s"
        cursor.execute(update_query, (user_id, product_id))
        connection.commit()

        cursor.close()

        return jsonify({"message": "Image uploaded and information saved successfully"})

    except ValueError as ve:
        return jsonify({"error": f"Error: {str(ve)}"}), 400
    except Exception as error:
        return jsonify({"error": f"Unexpected error: {str(error)}"}), 500


def change_user_profile(db_connector, user_id, image_data_base64):
    try:
        # Odkodowanie danych obrazu z Base64
        image_data = base64.b64decode(image_data_base64.split(",")[1])

        # Aktualny timestamp jako unikalna nazwa pliku
        image_name = f"{int(time.time())}.jpg"

        # Nowa lokalizacja folderu, gdzie mają być zapisane obrazy
        images_folder = 'D:\\repo_na_test\\Projekt-PWAAdi\\icer\\src\\data\\userPhotos'

        # Tworzenie ścieżki do zapisu obrazu
        image_path = os.path.join(images_folder, image_name)

        # Zapis odkodowanego obrazu na serwerze
        with open(image_path, 'wb') as image_file:
            image_file.write(image_data)

        # Uzyskanie połączenia z bazą danych
        connection = db_connector.get_connection()
        cursor = connection.cursor()

        # Sprawdzenie, czy wartość podstawowe_profilowe wynosi 0
        check_profile_query = "SELECT podstawowe_profilowe FROM preferencje_uzytkownikow WHERE UserID = %s"
        cursor.execute(check_profile_query, (user_id,))
        profile_result = cursor.fetchone()

        if profile_result and profile_result[0] == 0:
            # Usunięcie aktualnego zdjęcia użytkownika
            delete_query = "UPDATE preferencje_uzytkownikow SET lokalizacja_zdj = NULL WHERE UserID = %s"
            cursor.execute(delete_query, (user_id,))
            connection.commit()

        # Zapis informacji o zdjęciu do bazy danych w tabeli preferencje_uzytkownikow
        insert_query = """
            INSERT INTO preferencje_uzytkownikow 
            (UserID, podstawowe_profilowe, lokalizacja_zdj)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE lokalizacja_zdj = VALUES(lokalizacja_zdj)
        """
        cursor.execute(insert_query, (user_id, 0, image_name))
        connection.commit()

        cursor.close()

        return jsonify({"message": "User profile image changed successfully"})

    except ValueError as ve:
        return jsonify({"error": f"Error: {str(ve)}"}), 400
    except Exception as error:
        return jsonify({"error": f"Unexpected error: {str(error)}"}), 500
