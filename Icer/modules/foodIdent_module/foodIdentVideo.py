from concurrent.futures import ThreadPoolExecutor, as_completed
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


def load_models(model_paths):
    models = []
    current_directory = os.path.dirname(os.path.abspath(__file__))
    
    for model_path in model_paths:
        model_file_path = os.path.join(current_directory, model_path)
        model = tf.keras.models.load_model(model_file_path)
        models.append(model)
    
    return models

model_paths = ["model_1.h5", "model_2.h5"]
models = load_models(model_paths) 

# Global variables to control the camera thread
camera_thread = None
camera_running = False

def predict_with_model(model, img_tensor):
    pred = model.predict(img_tensor)
    pred_class_index = tf.argmax(pred, axis=1).numpy()[0]
    return pred, pred_class_index
    
def model_predict(model, img_tensor):
    # Predict and return both the prediction and class index
    pred = model.predict(img_tensor)
    pred_class_index = tf.argmax(pred, axis=1).numpy()[0]
    return pred, pred_class_index
    

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


def pred_and_plot(models, img, class_names, food_list, session):
    # Connect to the database
    db_connector = DatabaseConnector("localhost", "root", "root", "Sklep")
    db_connector.connect()
    connection = db_connector.get_connection()
    if not connection:
        raise ConnectionError("Failed to establish a connection with the database.")
    cursor = connection.cursor(dictionary=True)
    if not cursor:
        raise Exception("Failed to create a cursor for the database.")

    # Retrieve the username of the logged-in user
    user_id, username, response, status_code = DatabaseConnector.get_user_id_by_username(cursor, session)
    if response:
        return response, status_code  # Assuming this handles errors or redirects

    img_tensor = tf.convert_to_tensor(img, dtype=tf.float32)
    if len(img_tensor.shape) == 3:
        img_tensor = tf.expand_dims(img_tensor, axis=0)

    votes = {class_name: 0 for class_name in class_names}
    probabilities = []
    detailed_predictions = []

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
                print(f"Error in model prediction: {e}")

    # Logic to determine the predicted class remains the same...
    # Determine the class with the most votes
    max_votes = max(votes.values())
    winners = [class_name for class_name, vote in votes.items() if vote == max_votes]

    if len(winners) != 1:
        avg_probabilities = {class_name: 0 for class_name in class_names}
        for pred, _, pred_class_name in detailed_predictions:
            avg_probabilities[pred_class_name] += np.max(pred)
        for class_name in avg_probabilities:
            avg_probabilities[class_name] /= votes.values().count(max_votes)  # Adjust this line if needed
        pred_class = max(avg_probabilities, key=avg_probabilities.get)
    else:
        pred_class = winners[0]

    max_pred_value = max(probabilities)

    if max_pred_value >= 0.70 and pred_class not in food_list:
        food_list.append(pred_class)

    current_dir = os.path.dirname(__file__)
    project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
    save_dir = os.path.join(project_root, 'static', 'scanned')
    os.makedirs(save_dir, exist_ok=True)

    # Use the username to name the JSON file
    json_file_path = os.path.join(save_dir, f'{username}_food_list.json')

    # Save the food_list to the specified file path
    with open(json_file_path, 'w') as json_file:
        json.dump(food_list, json_file, indent=4)

    return food_list
   


def process_video():
    global camera_running

    def find_first_available_camera(max_checks=10):
        for i in range(max_checks):
            cap = cv2.VideoCapture(i)
            if cap.isOpened():
                cap.release()
                return i
        return -1

    camera_id = find_first_available_camera()
    if camera_id == -1:
        return "No available cameras found"

    cap = cv2.VideoCapture(camera_id)
    if not cap.isOpened():
        return f"Camera with ID {camera_id} could not be opened"

    cap.set(cv2.CAP_PROP_CONVERT_RGB, 1.0)  # Ensure frames are in RGB format
    cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))  # Set the codec

    target_frame_rate = 4  # Target frame rate
    frame_interval = int(1000 / target_frame_rate)  # Interval in milliseconds

    last_processed_time = time.time()

    while camera_running:
        current_time = time.time()
        elapsed_time = current_time - last_processed_time

        if elapsed_time * 1000 >= frame_interval:
            ret, frame = cap.read()

            if not ret:
                break

            # Save the captured frame as a temporary file to use with load_and_prep_image
            temp_filename = 'temp_frame.jpg'
            cv2.imwrite(temp_filename, frame)  # Save the frame
            preprocessed_frame = load_and_prep_image(temp_filename)

            # Make a food recognition prediction using the ensemble of models
            predicted_food_list = pred_and_plot(models, preprocessed_frame, class_names, food_list)

            # Display the result on the frame
            # Adjust this part as necessary to display your desired text
            display_text = f'Food: {predicted_food_list[-1]}' if predicted_food_list else 'Food: Uncertain'
            cv2.putText(frame, display_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

            # Convert the frame to JPEG format
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            # Yield the frame in a format that Flask can stream
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

            last_processed_time = current_time

    cap.release()
    # Normal termination of the camera process
    return "Camera Stopped"
      
def start_camera():
    global camera_running, camera_thread, camera_status

    if not camera_running:
        camera_running = True
        camera_status = None  # Reset the status
        camera_thread = threading.Thread(target=process_video)
        camera_thread.start()

def stop_camera():
    global camera_running, camera_thread, camera_status

    if camera_running:
        camera_running = False
        camera_thread.join()
        camera_status = "Stopped"







# def load_model(model_path):
    # current_directory = os.path.dirname(os.path.abspath(__file__))
    # model_file_path = os.path.join(current_directory, model_path)
    # model = tf.keras.models.load_model(model_file_path)
    # return model

# model = load_model('model3.h5')  


# def pred_and_plot(model, img, class_names, food_list):

    # img_tensor = tf.convert_to_tensor(img, dtype=tf.float32)


    # if len(img_tensor.shape) == 3:
        # img_tensor = tf.expand_dims(img_tensor, axis=0)


    # pred = model.predict(img_tensor)


    # pred_class_index = tf.argmax(pred, axis=1).numpy()[0]
    # max_pred_value = np.max(pred)

    # if max_pred_value >= 0.60:

        # pred_class = class_names[pred_class_index]


        # if pred_class not in food_list:

            # food_list.append(pred_class)


    # current_dir = os.path.dirname(__file__)


    # json_file_path = os.path.join(current_dir, 'food_list.json')


    # with open(json_file_path, 'w') as json_file:
        # json.dump(food_list, json_file, indent=4)

    # return food_list
    
    
    
    
    # def process_video():
    # global camera_running

    # def find_first_available_camera(max_checks=10):
        # for i in range(max_checks):
            # cap = cv2.VideoCapture(i)
            # if cap.isOpened():
                # cap.release()
                # return i
        # return -1

    # camera_id = find_first_available_camera()
    # if camera_id == -1:
        # return "No available cameras found"

    # cap = cv2.VideoCapture(camera_id)
    # if not cap.isOpened():
        # return f"Camera with ID {camera_id} could not be opened"

    # cap.set(cv2.CAP_PROP_CONVERT_RGB, 1.0)  # Ensure frames are in RGB format
    # cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))  # Set the codec

    # target_frame_rate = 5  # Target frame rate (2 frames per second)
    # frame_interval = int(1000 / target_frame_rate)  # Interval in milliseconds

    # last_processed_time = time.time()

    # while camera_running:
        # current_time = time.time()
        # elapsed_time = current_time - last_processed_time

        # if elapsed_time * 1000 >= frame_interval:
            # ret, frame = cap.read()

            # if not ret:
                # break

            # frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            # resized_frame = cv2.resize(frame, (224, 224))
            # preprocessed_frame = resized_frame / 255.0
            # preprocessed_frame = preprocessed_frame.reshape((1, 224, 224, 3))


            # predicted_class = pred_and_plot(model, preprocessed_frame, class_names, food_list)


            # display_text = f'Food: {predicted_class}' if predicted_class else 'Food: Uncertain'
            # cv2.putText(frame, display_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)


            # ret, buffer = cv2.imencode('.jpg', frame)
            # frame = buffer.tobytes()


            # yield (b'--frame\r\n'
                   # b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

            # last_processed_time = current_time

    # cap.release()

    # return "Camera Stopped"  