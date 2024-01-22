import cv2
import requests
import winsound
import time
from .sharedres.shared import camera_status

def print_and_send(data):
    print(data)
    api_endpoint = "http://192.168.0.130:5000/start_camera_monitoring"
    try:
        response = requests.post(api_endpoint, json={'dane': data})
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Błąd wysyłania danych: {e}")
# Function to detect faces and eyes in an image
def detect_faces_and_eyes(image):
    gray_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Load Haar cascades for face and eye detection
    face_classifier = cv2.CascadeClassifier('modules/advert_module/haarcascade_frontalface_default.xml')
    eye_classifier = cv2.CascadeClassifier('modules/advert_module/haarcascade_eye.xml')

    # Detect faces and eyes in the image
    detected_faces = face_classifier.detectMultiScale(gray_img, scaleFactor=1.2, minNeighbors=5, minSize=(20, 20))
    detected_eyes = eye_classifier.detectMultiScale(gray_img, scaleFactor=1.2, minNeighbors=4, minSize=(10, 10))

    return detected_faces, detected_eyes

# Function to play an audio warning
def play_audio_warning():
    winsound.Beep(440, 500)

# Function to display a warning image
def display_warning_image(image):
    cv2.imshow('ACHTUNG', image)
    cv2.waitKey(-1)
    cv2.destroyWindow('ACHTUNG')

# Function to start camera monitoring
def generate_frames():
    global camera_status
    from Icer.mainAPI import socketio
    video_ended = False

    # Try to initialize the webcam
    cap1 = cv2.VideoCapture(0)  # Webcam

    # Check if the webcam is accessible
    if cap1.isOpened():
        cap2 = cv2.VideoCapture('modules/advert_module/videoplayback.mp4')  # Default video file
    else:
        cap2 = cv2.VideoCapture('modules/advert_module/videoplaybackalt.mp4')  # Alternate video file

    img2 = cv2.imread('modules/advert_module/image.jpg')  # Warning image
    beep = 0

    # Get the frame rate of the video file
    fps = cap2.get(cv2.CAP_PROP_FPS)
    if fps < 1:  # Fallback for undetected frame rate
        fps = 30  # Assume standard frame rate

    frame_duration = 1.0 / fps  # Calculate frame duration in seconds

    while True:
        ret1, frame = cap2.read()
        if not ret1:
            video_ended = True  # End of video file or error

        if cap1.isOpened():
            ret, img = cap1.read()
            if not ret:
                continue  # Skip if webcam frame is not ready

            # Detect faces and eyes
            detected_faces, detected_eyes = detect_faces_and_eyes(img)
            # ... Draw rectangles logic (optional for streaming) ...

            if len(detected_eyes) == 0 and len(detected_faces) == 0:
                if beep == 5:
                    play_audio_warning()
                    beep = 0
                else:
                    beep += 1
            else:
                beep = 0

            # Check if video has ended
            if video_ended:
                camera_status = 'finished'
                socketio.emit('update_status', {'new_value': camera_status})
                print_and_send(camera_status)
                break  # Exit loop after sending end signal

        # Convert image to JPEG format
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            continue  # Skip if frame encoding fails

        frame_bytes = buffer.tobytes()
        time.sleep(frame_duration)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    if cap1.isOpened():
        cap1.release()
    cap2.release()


#if __name__ == '__main__':
#    start_camera_monitoring()
