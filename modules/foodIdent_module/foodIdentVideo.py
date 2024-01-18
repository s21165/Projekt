import cv2
import os
import json
import tensorflow as tf
import time
import threading
import numpy as np

# Global variable to store recognized food items
food_list = []

def load_and_prep_image(filename, img_shape=224):
    # Read the image file
    img = tf.io.read_file(filename)

    # Decode the image into a tensor with 3 channels (RGB)
    img = tf.image.decode_image(img, channels=3)

    # Resize the image to the specified img_shape
    img = tf.image.resize(img, size=[img_shape, img_shape])

    # Normalize the image pixel values to the range [0, 1]
    img = img / 255.

    # Cast the image to float32 data type
    img = tf.cast(img, dtype=tf.float32)

    # Return the preprocessed image
    return img


def pred_and_plot(model, img, class_names, food_list):
    # Ensure img is a tensor
    img_tensor = tf.convert_to_tensor(img, dtype=tf.float32)

    # Check if the tensor needs to be expanded to include batch dimension
    if len(img_tensor.shape) == 3:
        img_tensor = tf.expand_dims(img_tensor, axis=0)

    # Make a prediction using the model
    pred = model.predict(img_tensor)

    # Get the index and value of the highest probability in the prediction array
    pred_class_index = tf.argmax(pred, axis=1).numpy()[0]
    max_pred_value = np.max(pred)

    if max_pred_value >= 0.60:
        # Get the corresponding class name from class_names list
        pred_class = class_names[pred_class_index]

        # Check if this food item is not already in the list
        if pred_class not in food_list:
            # Add to the list
            food_list.append(pred_class)

    # Get the directory of the current script
    current_dir = os.path.dirname(__file__)

    # Specify the path to write the JSON file in the current directory
    json_file_path = os.path.join(current_dir, 'food_list.json')

    # Save the food list to a JSON file
    with open(json_file_path, 'w') as json_file:
        json.dump(food_list, json_file, indent=4)

    return food_list
   
def load_model(model_path):
    current_directory = os.path.dirname(os.path.abspath(__file__))
    model_file_path = os.path.join(current_directory, model_path)
    model = tf.keras.models.load_model(model_file_path)
    return model

model = load_model('model3.h5')  
class_names = ['ciasto_czekoladowe', 'donut', 'frytki', 'hamburger', 'lasagne', 'makaroniki', 'nalesniki', 'pizza', 'salatka_cezar', 'skrzydelka_z_kurczaka', 'sushi', 'szarlotka', 'tatar', 'tiramisu', 'zeberka']

# Global variables to control the camera thread
camera_thread = None
camera_running = False


def process_video():
    global camera_running

    # Try to open the webcam
    cap = cv2.VideoCapture(0)

    # Check if the camera is opened successfully
    if not cap.isOpened():
        print("Camera not detected")
        return

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
            cv2.imshow('Food Recognition', frame)

            last_processed_time = current_time

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

      
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

