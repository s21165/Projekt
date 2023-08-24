import cv2
import winsound

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
def start_camera_monitoring():
    # Initialize video captures
    cap1 = cv2.VideoCapture(0)  # Webcam
    cap2 = cv2.VideoCapture('modules/advert_module/videoplayback.mp4')  # Video file
    img2 = cv2.imread('modules/advert_module/image.jpg')  # Warning image

    count = 0
    beep = 0
    frm2 = None

    while cap2.isOpened():
        ret1, frm1 = cap2.read()
        if ret1:
            if count > 5:
                _, frm2 = cap2.read()

            if frm2 is not None:
                cv2.imshow("AD", frm2)

            if frm1 is not None:
                ret, img = cap1.read()
                detected_faces, detected_eyes = detect_faces_and_eyes(img)

                # Draw rectangles around detected faces and eyes
                for (x, y, width, height) in detected_faces:
                    cv2.rectangle(img, (x, y), (x + width, y + height), (0, 0, 255), 10)

                for (x, y, w, h) in detected_eyes:
                    cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 255), 3)

                cv2.imshow("monitoring", img)

                # Play warning audio and display warning image if no faces or eyes detected
                if len(detected_eyes) == 0 and len(detected_faces) == 0:
                    if beep == 5:
                        play_audio_warning()
                        beep = 0
                        display_warning_image(img2)
                    else:
                        beep += 1
                else:
                    beep = 0

            count += 1
            cv2.waitKey(1)

        else:
            break

    cap1.release()
    cap2.release()
    cv2.destroyAllWindows()

#if __name__ == '__main__':
#    start_camera_monitoring()
