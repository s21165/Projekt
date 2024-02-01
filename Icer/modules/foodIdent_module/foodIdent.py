import tensorflow as tf
import matplotlib.pyplot as plt
import numpy as np
import os
import json

def load_and_prep_image(filename, img_shape=224):
  # Read the image file
  img = tf.io.read_file(filename)

  # Decode the image into a tensor with 3 channels (RGB)
  img = tf.image.decode_image(img, channels=3)

  # Resize the image to the specified img_shape
  img = tf.image.resize(img, size=[img_shape, img_shape])

  # Normalize the image pixel values to the range [0, 1]
  img = img / 255.

  # Return the preprocessed image
  return img
  

def pred_and_plot(model, filename, class_names):
    # Load and preprocess the image
    img = load_and_prep_image(filename)
    
    # Make a prediction using the model
    pred = model.predict(tf.expand_dims(img, axis=0))
    print("Prediction array:", pred)

    pred_class = None
    if pred is not None and len(pred) > 0:
        # Get the maximum probability from the prediction
        max_pred_value = np.max(pred)

        # Check if the maximum probability is above the threshold
        if max_pred_value >= 0.60:
            # Get the predicted class index
            pred_class_index = tf.argmax(pred, axis=1).numpy()[0]
            
            # Get the corresponding class name from class_names list
            pred_class = class_names[pred_class_index]
        else:
            print("Prediction confidence is too low.")

    # Get the directory of the current script
    current_dir = os.path.dirname(__file__)

    # Specify the path to write the JSON file in the current directory
    json_file_path = os.path.join(current_dir, 'prediction_result.json')

    # Save the prediction result to a JSON file
    prediction_result = {"predicted_class": pred_class}
    
    with open(json_file_path, 'w') as json_file:
        json.dump(prediction_result, json_file, indent=4)
    
    return pred_class


#Loading trained model    
def load_model(model_path):
    current_directory = os.path.dirname(os.path.abspath(__file__))
    model_file_path = os.path.join(current_directory, model_path)
    model = tf.keras.models.load_model(model_file_path)
    return model