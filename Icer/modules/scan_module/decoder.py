import qrcode
from pyzbar.pyzbar import decode
from PIL import Image
import json
import os


# Dekodowanie QR z obrazu
def decode_qr_code(image_path):
    qr_image = Image.open(image_path)
    decoded_objects = decode(qr_image)
    
    if decoded_objects:
        decoded_data = decoded_objects[0].data.decode('utf-8')
        
        # Znajdź lokalizację skryptu
        current_dir = os.path.dirname(__file__)

        # Podaj PATH do zapisania JSON
        json_file_path = os.path.join(current_dir, 'decoded_data.json')

        # Dictionary do przechowywania danych
        data_dict = {"decoded_data": decoded_data}
        
        # Zapisz JSON w obecnym folderze
        with open(json_file_path, 'w') as json_file:
            json.dump(data_dict, json_file, indent=4)
        
        return decoded_data
    else:
        return "QR code not detected"
