import os
import qrcode
import barcode
import json
from barcode.writer import ImageWriter
from PIL import Image

# Generate QR code based on data and save it to the output folder
def generate_qr_code(data, output_folder):
    # Construct the data string for the QR code
    qr_data = f"Name:{data['name']}, Price:{data['price']}, Kcal:{data['kcal']}, Fat:{data['fat']}, Carbs:{data['carbs']}, Protein:{data['protein']}, Category:{data['category']}, Amount:{data['amount']}"
    
    # Create a QR code object
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    # Add the data to the QR code
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    # Generate the QR code image
    qr_image = qr.make_image(fill_color="black", back_color="white")
    
    # Construct the image filename and path
    image_filename = f"{data['name']}_{data['category']}_qr.png"
    image_path = os.path.join(output_folder, image_filename)
    
    # Save the QR code image
    qr_image.save(image_path)
    
    return image_filename

# Generate barcode based on data and save it to the output folder
def generate_barcode(data, output_folder):
    # Create a dictionary with the data
    barcode_data = {
        "name": data["name"],
        "price": data["price"],
        "kcal": data["kcal"],
        "fat": data["fat"],
        "carbs": data["carbs"],
        "protein": data["protein"],
        "category": data["category"],
        "amount": data["amount"]
    }

    # Convert the dictionary to a JSON string
    barcode_json = json.dumps(barcode_data)

    # Generate the barcode using the JSON data
    barcode = Code128(barcode_json, writer=ImageWriter())
    
    # Construct the image filename and path
    image_filename = f"{data['name']}_{data['category']}.png"
    image_path = os.path.join(output_folder, image_filename)
    
    # Save the barcode image with the JSON data as part of the filename
    barcode.save(image_path)

    return image_filename
