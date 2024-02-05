from concurrent.futures import ThreadPoolExecutor, as_completed
import cv2
import os
import json
import tensorflow as tf
import time
import threading
import numpy as np

# Definicjazamka
file_lock = threading.Lock()

# Globalna zmienna przechowująca rozpoznane produkty 
food_list = []

# Ścieżka do pliku JSON zawierającego nazwy klas
json_file_path = 'modules/foodIdent_module/classes.json'
with open(json_file_path, 'r') as json_file:
    data = json.load(json_file)
class_names = data.get('class_names', [])

# Ładowanie modeli
def load_models(model_paths):
    models = []
    current_directory = os.path.dirname(os.path.abspath(__file__))
    
    for model_path in model_paths:
        model_file_path = os.path.join(current_directory, model_path)
        model = tf.keras.models.load_model(model_file_path)
        models.append(model)
    
    return models

# Ścieżki do modeli, które będą załadowane
model_paths = ["model_1.h5", "model_2.h5"]
models = load_models(model_paths) 


# Zmienne globalne do kontrolowania camera_thread
camera_thread = None
camera_running = False

def predict_with_model(model, img_tensor):
    pred = model.predict(img_tensor)
    pred_class_index = tf.argmax(pred, axis=1).numpy()[0]
    return pred, pred_class_index
    
def model_predict(model, img_tensor):
    # Przewiduj i zwracaj zarówno predykcję i indeks klasy
    pred = model.predict(img_tensor)
    pred_class_index = tf.argmax(pred, axis=1).numpy()[0]
    return pred, pred_class_index
    

def load_and_prep_image(filename, img_shape=224):
    # Odczytaj plik obrazu
    img = tf.io.read_file(filename)

    # Dekoduj obraz
    img = tf.image.decode_image(img, channels=3)

    # Zmień rozmiar obrazu do zgodnego z modelem
    img = tf.image.resize(img, size=[img_shape, img_shape])

    # Znormalizuj wartości pikseli obrazu do zakresu [0, 1]
    img = img / 255.

    # Przekształć obraz na typ danych float32
    img = tf.cast(img, dtype=tf.float32)

    # Zwróć przygotowany obraz
    return img


# Predykcja
def pred_and_plot(models, img, class_names, food_list, username):
    # Przygotowanie obrazu
    img_tensor = tf.convert_to_tensor(img, dtype=tf.float32)
    if len(img_tensor.shape) == 3:
        img_tensor = tf.expand_dims(img_tensor, axis=0)

    # Inicjalizacja zmiennych do głosowania na klasy
    votes = {class_name: 0 for class_name in class_names}
    probabilities = []
    detailed_predictions = []

    # Uruchom wiele modeli równocześnie by szybciej przewidywać
    with ThreadPoolExecutor(max_workers=len(models)) as executor:
        futures = {executor.submit(model_predict, model, img_tensor): model for model in models}

        for future in as_completed(futures):
            try:
                pred, pred_class_index = future.result()
                pred_class_name = class_names[pred_class_index]
                votes[pred_class_name] += 1
                probabilities.append(np.max(pred))
                detailed_predictions.append((pred, pred_class_index, pred_class_name))
            except Exception as e:
                print(f"Błąd w przewidywaniu modelu: {e}")

    # Określenie klasy z największą liczbą głosów
    max_votes = max(votes.values())
    winners = [class_name for class_name, vote in votes.items() if vote == max_votes]

    if len(winners) != 1:
        # Obliczenie średnich prawdopodobieństw w przypadku remisu
        avg_probabilities = {class_name: 0 for class_name in class_names}
        for pred, _, pred_class_name in detailed_predictions:
            avg_probabilities[pred_class_name] += np.max(pred)
        for class_name in avg_probabilities:
            avg_probabilities[class_name] /= list(votes.values()).count(max_votes)
        pred_class = max(avg_probabilities, key=avg_probabilities.get)
    else:
        pred_class = winners[0]

    # Określenie maksymalnej wartości prawdopodobieństwa
    max_pred_value = max(probabilities)

    # Jeśli prawdopodobieństwo jest większe niż wymagane i przewidziana klasa nie jest dodana, to dodaj
    if max_pred_value >= 0.70 and pred_class not in food_list:
        food_list.append(pred_class)

    # Ustalenie ścieżki do zapisu pliku
    current_dir = os.path.dirname(__file__)
    project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
    save_dir = os.path.join(project_root, 'static', 'scanned')
    os.makedirs(save_dir, exist_ok=True)

    # Użyj nazwy użytkownika przy zapisywaniu nazwy
    json_file_path = os.path.join(save_dir, f'{username}_food_list.json')

    # Zapisz food_list
    with file_lock:
        with open(json_file_path, 'w') as json_file:
            json.dump(food_list, json_file, indent=4)

    return food_list


# Proces wideo i przekazanie nazwy użytkownika
def process_video(username):
    global camera_running

    # Funkcja pomocnicza do znalezienia pierwszej dostępnej kamery
    def find_first_available_camera(max_checks=5):
        for i in range(max_checks):
            cap = cv2.VideoCapture(i)
            if cap.isOpened():
                cap.release()
                return i
        return -1

    # Znalezienie dostępnej kamery
    camera_id = find_first_available_camera()
    #Jeśli nie znaleziono kamery
    if camera_id == -1:
        return "Nie znaleziono dostępnych kamer"

    # Otwarcie znalezionej spoko
    cap = cv2.VideoCapture(camera_id)
    if not cap.isOpened():
        return f"Nie można otworzyć kamery o identyfikatorze {camera_id}"

    # Ustawienia kamery: konwersja na format RGB i ustawienie kodeka
    cap.set(cv2.CAP_PROP_CONVERT_RGB, 1.0)
    cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))

    # Redukcja ilośći klatek, by nie przeciążać serwera i nie wykonywać zbyt wielu predykcji na sekundę
    target_frame_rate = 4
    frame_interval = int(1000 / target_frame_rate)

    last_processed_time = time.time()

    while camera_running:
        current_time = time.time()
        elapsed_time = current_time - last_processed_time

        # Przetwarzanie klatki po upływie czasu
        if elapsed_time * 1000 >= frame_interval:
            ret, frame = cap.read()

            if not ret:
                break

            # Zapisanie przechwyconej klatki jako pliku tymczasowego
            temp_filename = 'temp_frame.jpg'
            cv2.imwrite(temp_filename, frame)

            # Przygotowanie obrazu i przewidywanie jedzenia z funkcji pred_and_plot
            preprocessed_frame = load_and_prep_image(temp_filename)
            predicted_food_list = pred_and_plot(models, preprocessed_frame, class_names, food_list, username)

            # Wyświetlenie wyniku w oknie wideo
            display_text = f'Jedzenie: {predicted_food_list[-1]}' if predicted_food_list else 'Jedzenie: Niepewne'
            cv2.putText(frame, display_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            # Konwersja formatu JPEG
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            # Zwrócenie klatki w formacie, który może być strumieniowany przez Flask
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


# Funkcja start_camera rozpoczyna przechwytywanie wideo z kamery.
# Przekazuje nazwę użytkownika jako argument do funkcji process_video.
def start_camera(username):
    # Sprawdź, czy lista food_list nie jest pusta
    try:
        if food_list:
            # czyszcenie, jeśli lista nie jest pusta
            food_list.clear()
    except Exception as e:
        print(f"Error while clearing existing data: {e}")
    
    global camera_running, camera_thread, camera_status

    # Sprawdzanie, czy kamera nie jest już uruchomiona
    if not camera_running:
        camera_running = True
        camera_status = None  # Zresetuj status kamery
        camera_thread = threading.Thread(target=process_video, args=(username,))  # Przekazanie nazwy użytkownika jako argument
        camera_thread.start()  # Uruchom wątek kamery


# Funkcja stop_camera zatrzymuje przechwytywanie wideo z kamery, kończąc rozpoznawanie
def stop_camera():
    global camera_running, camera_thread, camera_status

    # Sprawdzanie, czy kamera jest uruchomiona
    if camera_running:
        camera_running = False
        camera_thread.join()  # Czekaj na zakończenie wątku kamery
        camera_status = "Zatrzymano"  # Ustaw status kamery na "Zatrzymano"







