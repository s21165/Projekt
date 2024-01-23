import cv2
import time
import tensorflow as tf

from foodIdent import load_and_prep_image, pred_and_plot, load_model


model = load_model('path_to_your_model.h5')
class_names = ['list', 'of', 'your', 'class', 'names']

def capture_frames():
    # Initialize video capture
    cap = cv2.VideoCapture(0)
    food_list = []

    try:
        while True:
            start_time = time.time()

            # Capture two frames per second
            for _ in range(2):
                ret, frame = cap.read()
                if not ret:
                    break

                # Process and predict the frame
                recognized_food = process_frame(frame, model, class_names)
                if recognized_food and recognized_food not in food_list:
                    food_list.append(recognized_food)

                # Wait to capture the next frame
                time.sleep(max(0, 0.5 - (time.time() - start_time)))

            # Display the frame (optional)
            cv2.imshow('Frame', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    finally:
        # Release the capture
        cap.release()
        cv2.destroyAllWindows()

    return food_list

def process_frame(frame, model, class_names):

    # Resize and preprocess the frame
    processed_frame = cv2.resize(frame, (224, 224))
    processed_frame = processed_frame / 255.0  # If your model expects pixel values in [0,1]

    # Predict
    prediction = model.predict(tf.expand_dims(processed_frame, axis=0))
    pred_class_index = tf.argmax(prediction, axis=1).numpy()[0]
    pred_class = class_names[pred_class_index]

    return pred_class

if __name__ == "__main__":
    recognized_foods = capture_frames()
    print("Recognized food items:", recognized_foods)