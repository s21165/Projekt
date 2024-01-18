# from barcode import get_barcode
import qrcode
from pyzbar.pyzbar import decode
from PIL import Image
import json
import os

# Function to decode a barcode from an image
# def decode_barcode(image_path):
    # barcode_image = Image.open(image_path)
    # decoded_objects = decode(barcode_image)
    
    # if decoded_objects:
        # decoded_data = decoded_objects[0].data.decode('utf-8')
        # return decoded_data
    # else:
        # return "No barcode found"

# Function to decode a QR code from an image
def decode_qr_code(image_path):
    qr_image = Image.open(image_path)
    decoded_objects = decode(qr_image)
    
    if decoded_objects:
        decoded_data = decoded_objects[0].data.decode('utf-8')
        
        # Get the directory of the current script
        current_dir = os.path.dirname(__file__)

        # Specify the path to write the JSON file in the current directory
        json_file_path = os.path.join(current_dir, 'decoded_data.json')

        # Create a dictionary to store the decoded data
        data_dict = {"decoded_data": decoded_data}
        
        # Write the dictionary to a JSON file in the current directory
        with open(json_file_path, 'w') as json_file:
            json.dump(data_dict, json_file, indent=4)
        
        return decoded_data
    else:
        return "QR code not detected"