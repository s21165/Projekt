import cv2
import numpy as np
import winsound
import time
import requests


def print_and_send(data):
    # Funkcja do drukowania danych i wysyłania ich za pomocą API
    print(data)
    api_endpoint = "http://192.168.0.130:5000/start_camera_monitoring"
    try:
        response = requests.post(api_endpoint, json={'dane': data})
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Błąd wysyłania danych: {e}")

# Funkcja do wykrywania twarzy i oczu na obrazie
def detect_faces_and_eyes(image):
    # Konwersja obrazu na odcienie szarości
    gray_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Wczytanie kaskad Haara do detekcji twarzy i oczu
    face_classifier = cv2.CascadeClassifier('modules/advert_module/haarcascade_frontalface_default.xml')
    eye_classifier = cv2.CascadeClassifier('modules/advert_module/haarcascade_eye.xml')

    # Wykrywanie twarzy i oczu na obrazie
    detected_faces = face_classifier.detectMultiScale(gray_img, scaleFactor=1.2, minNeighbors=5, minSize=(20, 20))
    detected_eyes = eye_classifier.detectMultiScale(gray_img, scaleFactor=1.2, minNeighbors=4, minSize=(10, 10))

    return detected_faces, detected_eyes

# Funkcja do odtwarzania ostrzeżenia dźwiękowego
def play_audio_warning():
    # Odtwarzanie dźwięku 'beep' przez 500 milisekund
    winsound.Beep(440, 500)

# Funkcja do wyświetlania obrazka ostrzeżenia
def display_warning_image(image):
    # Wyświetlenie obrazka ostrzeżenia z tytułem 'ACHTUNG' i oczekiwaniem na interakcję użytkownika
    cv2.imshow('ACHTUNG', image)
    cv2.waitKey(-1)
    cv2.destroyWindow('ACHTUNG')

# Funkcja do rozpoczęcia monitoringu kamery
def generate_frames():
    global camera_status
    from mainAPI import socketio
    video_ended = False

    # Próba zainicjowania kamery internetowej
    cap1 = cv2.VideoCapture(0)  # Kamera internetowa

    # Sprawdzenie dostępności kamery internetowej
    if cap1.isOpened():
        cap2 = cv2.VideoCapture('modules/advert_module/videoplayback.mp4')  # Domyślny plik wideo
    else:
        cap2 = cv2.VideoCapture('modules/advert_module/videoplaybackalt.mp4')  # Alternatywny plik wideo

    img2 = cv2.imread('modules/advert_module/image.jpg') 
    beep = 0

    # Pobranie liczby klatek na sekundę z pliku wideo
    fps = cap2.get(cv2.CAP_PROP_FPS)
    if fps < 1:  # Wartość domyślna w przypadku braku wykrytej liczby klatek na sekundę
        fps = 30  # Przyjęcie standardowej liczby klatek na sekundę

    frame_duration = 1.0 / fps  # Obliczenie długości trwania klatki w sekundach

    while True:
        ret1, frame = cap2.read()
        if not ret1:
            video_ended = True  # Koniec pliku wideo lub błąd

        if cap1.isOpened():
            ret, img = cap1.read()
            if not ret:
                continue  # Pominięcie, jeśli klatka z kamery internetowej nie jest gotowa

            # Wykrywanie twarzy i oczu
            detected_faces, detected_eyes = detect_faces_and_eyes(img)
            # ... Logika rysowania prostokątów (opcjonalna przy przesyłaniu strumieniowym) ...

            if len(detected_eyes) == 0 and len(detected_faces) == 0:
                if beep == 5:
                    play_audio_warning()
                    beep = 0
                else:
                    beep += 1
            else:
                beep = 0

            # Sprawdzenie, czy plik wideo został zakończony
            if video_ended:
                camera_status = 'finished'
                socketio.emit('update_status', {'new_value': camera_status})
                print_and_send(camera_status)
                break  # Wyjście z pętli po wysłaniu sygnału zakończenia

        # Konwersja obrazu na format JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            continue  # Pominięcie, jeśli nie uda się zakodować klatki

        frame_bytes = buffer.tobytes()
        time.sleep(frame_duration)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    if cap1.isOpened():
        cap1.release()
   

