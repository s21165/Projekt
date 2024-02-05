# image_handler.py

import os
import base64
from flask import jsonify

import time

from flask import jsonify

from flask import jsonify


def handle_image_upload(db_connector, image_data_base64, user_id, product_id):
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

        #usuwanie poprzedniego wpisu zdj.
        delete_query = "DELETE FROM UserPhotos WHERE produktID = %s AND userID = %s"
        cursor.execute(delete_query, (product_id, user_id))
        connection.commit()

        # Zapis informacji o zdjęciu do bazy danych w tabeli UserPhotos
        insert_query = "INSERT INTO UserPhotos (produktID, userID, lokalizacja) VALUES (%s, %s, %s)"
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
        check_profile_query = "SELECT podstawowe_profilowe, lokalizacja_zdj FROM preferencje_uzytkownikow WHERE UserID = %s"
        cursor.execute(check_profile_query, (user_id,))
        profile_result = cursor.fetchone()

        if profile_result:
            if profile_result[0] == 0:
                # Usunięcie poprzedniego zdjęcia użytkownika z serwera
                previous_image_location = profile_result[1]
                if previous_image_location:
                    previous_image_path = os.path.join(images_folder, previous_image_location)
                    if os.path.exists(previous_image_path):
                        os.remove(previous_image_path)
                update_query = "UPDATE preferencje_uzytkownikow SET lokalizacja_zdj = %s WHERE UserID = %s"
                cursor.execute(update_query, (image_name, user_id))

            elif profile_result[0] == 1:
                # Update lokalizacji zdjęcia użytkownika
                update_query = "UPDATE preferencje_uzytkownikow SET lokalizacja_zdj = %s, podstawowe_profilowe=%s WHERE UserID = %s"
                cursor.execute(update_query, (image_name, 0, user_id))
        else:
            # Brak wpisu dla tego użytkownika, wstaw nowy wpis
            insert_query = """
                INSERT INTO preferencje_uzytkownikow 
                (UserID, podstawowe_profilowe, lokalizacja_zdj)
                VALUES (%s, %s, %s)
            """
            cursor.execute(insert_query, (user_id, 0, image_name))

        connection.commit()
        cursor.close()

        return jsonify({"message": "User profile image changed successfully"})

    except ValueError as ve:
        return jsonify({"error": f"Error: {str(ve)}"}), 400
    except Exception as error:
        return jsonify({"error": f"Unexpected error: {str(error)}"}), 500
