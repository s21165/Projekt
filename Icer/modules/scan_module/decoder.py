import qrcode
import requests
from pyzbar.pyzbar import decode
from PIL import Image

# Function to decode a barcode from an image
def decode_barcode(image_path):
    barcode_image = Image.open(image_path)
    decoded_objects = decode(barcode_image)
    
    if decoded_objects:
        decoded_data = decoded_objects[0].data.decode('utf-8')
        return decoded_data
    else:
        return "No barcode found"

# Function to decode a QR code from an image

def decode_qr_code(image_path):
    qr_image = Image.open(image_path)
    decoded_objects = decode(qr_image)
    
    if decoded_objects:
        decoded_data = decoded_objects[0].data.decode('utf-8')
        return decoded_data
    else:
        return "QR code not detected"
