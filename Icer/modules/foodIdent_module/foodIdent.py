import os
import json
import tensorflow as tf
import matplotlib.pyplot as plt
import numpy as np
from modules.database_connector import DatabaseConnector

def load_and_prep_image(filename, img_shape=224):
    # Funkcja do wczytywania i przygotowywania obrazu
    # Wczytanie pliku obrazu
    img = tf.io.read_file(filename)
    # Dekodowanie obrazu do RGB
    img = tf.image.decode_image(img, channels=3)

    # Zmiana rozmiaru obrazu do określonego rozmiaru zgodnego z modelem
    img = tf.image.resize(img, size=[img_shape, img_shape])

    # Normalizacja wartości pikseli
    img = img / 255.

    # Zwraca przygotowany obraz
    return img


def pred_and_plot(model, filename, class_names, username):
    # Funkcja do przewidywania
    # Wczytanie i przygotowanie obrazu
    img = load_and_prep_image(filename)

    # Wykonanie predykcji za pomocą wytrenowanego modelu
    pred = model.predict(tf.expand_dims(img, axis=0))
    print("Tablica predykcji:", pred)

    pred_class = None
    if pred is not None and len(pred) > 0:
        max_pred_value = np.max(pred)  # Pobranie maksymalnej prawdopodobieństwa z predykcji
        if max_pred_value >= 0.60:  # Sprawdzenie, czy maksymalne prawdopodobieństwo jest powyżej akceptowanego progu
            pred_class_index = tf.argmax(pred, axis=1).numpy()[0]  # Pobranie indeksu przewidzianej klasy
            pred_class = class_names[pred_class_index]  # Pobranie odpowiadającej nazwy klasy z bazy klas
        else:
            print("Zbyt niska pewność predykcji.")

    # Pobranie katalogu
    current_dir = os.path.dirname(__file__)
    project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
    save_dir = os.path.join(project_root, 'static', 'scanned')
    os.makedirs(save_dir, exist_ok=True)  # Utworzenie katalogu, jeśli nie istnieje

    # wygenerowanie pliku z użyciem nazwy użytkownika
    json_file_path = os.path.join(save_dir, f'{username}_food_list.json')

    # Zapis wyników predykcji u
    prediction_result = [pred_class]
    with open(json_file_path, 'w') as json_file:
        json.dump(prediction_result, json_file, indent=4)

    return pred_class


# Wczytanie wcześniej wytrenowanego modelu
def load_model(model_path):
    current_directory = os.path.dirname(os.path.abspath(__file__))
    model_file_path = os.path.join(current_directory, model_path)
    model = tf.keras.models.load_model(model_file_path)
    return model
