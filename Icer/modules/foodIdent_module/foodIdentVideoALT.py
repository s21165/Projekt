import cv2
import os
import json
import tensorflow as tf
import time
import threading
import numpy as np

# Global variable to store recognized food items
food_list = []

json_file_path = 'modules/foodIdent_module/classes.json'
with open(json_file_path, 'r') as json_file:
    data = json.load(json_file)
class_names = data.get('class_names', [])

def load_model(model_path):
    current_directory = os.path.dirname(os.path.abspath(__file__))
    model_file_path = os.path.join(current_directory, model_path)
    model = tf.keras.models.load_model(model_file_path)
    return model

model = load_model('model3.h5')

# Global variables to control the camera thread
camera_thread = None
camera_running = False

def load_and_prep_image(filename, img_shape=224):
    # [Your existing code for image preprocessing]

def pred_and_plot(model, img, class_names, food_list):
    # [Your existing code for prediction and plotting]

def process_video():
    global camera_running

    try:
        # Try to open the webcam
        cap = cv2.VideoCapture(0)

        # Check if the camera is opened successfully
        if not cap.isOpened():
            raise IOError("Camera not detected")

        cap.set(cv2.CAP_PROP_CONVERT_RGB, 1.0)  # Ensure frames are in RGB format
        cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))  # Set the codec

        target_frame_rate = 2  # Target frame rate (2 frames per second)
        frame_interval = int(1000 / target_frame_rate)  # Interval in milliseconds

        last_processed_time = time.time()

        while camera_running:
            current_time = time.time()
            elapsed_time = current_time - last_processed_time

            if elapsed_time * 1000 >= frame_interval:
                ret, frame = cap.read()

                if not ret:
                    break

                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                resized_frame = cv2.resize(frame, (224, 224))
                preprocessed_frame = resized_frame / 255.0
                preprocessed_frame = preprocessed_frame.reshape((1, 224, 224, 3))

                # Make a food recognition prediction
                predicted_class = pred_and_plot(model, preprocessed_frame, class_names, food_list)

                # Display the result on the frame
                display_text = f'Food: {predicted_class}' if predicted_class else 'Food: Uncertain'
                cv2.putText(frame, display_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

                # Convert the frame to JPEG format
                ret, buffer = cv2.imencode('.jpg', frame)
                frame = buffer.tobytes()

                # Yield the frame in a format that Flask can stream
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

                last_processed_time = current_time

    except IOError as e:
        print(e)
        camera_running = False

    finally:
        if 'cap' in locals() and cap.isOpened():
            cap.release()

def start_camera():
    global camera_running, camera_thread

    if not camera_running:
        camera_running = True
        camera_thread = threading.Thread(target=process_video)
        camera_thread.start()

def stop_camera():
    global camera_running, camera_thread

    if camera_running:
        camera_running = False
        camera_thread.join()
