import tensorflow as tf
import matplotlib.pyplot as plt
import numpy as np
import os


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

    if pred is not None and len(pred) > 0:
        # Get the predicted class index
        pred_class_index = tf.argmax(pred, axis=1).numpy()[0]
        
        # Get the corresponding class name from class_names list
        pred_class = class_names[pred_class_index]
    else:
        pred_class = None
    
    return pred_class

    
def load_model(model_path):
    current_directory = os.path.dirname(os.path.abspath(__file__))
    model_file_path = os.path.join(current_directory, model_path)
    model = tf.keras.models.load_model(model_file_path)
    return model