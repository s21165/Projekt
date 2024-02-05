import os
import qrcode
import json
from PIL import Image


# Wygeneruj kod QR na podstawie danych i zapisz go
def generate_qr_code(data, output_folder):
    # Dane dla kodu QR
    qr_data = f"Nazwa:{data['name']}, Cena:{data['price']}, Kalorie:{data['kcal']}, Tłuszcze:{data['fat']}, Węglowodany:{data['carbs']}, Białko:{data['protein']}, Kategoria:{data['category']}, Ilość:{data['amount']}, Data:{data['date']}"
    
    #Utwórz obiekt kodu QR
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    
    # Dodaj dane do kodu QR
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    # Wygeneruj kod QR
    qr_image = qr.make_image(fill_color="black", back_color="white")
    
    # Plik i ścieżka
    image_filename = f"{data['name']}_{data['category']}_qr.png"
    image_path = os.path.join(output_folder, image_filename)
    
    # Zapisz QR
    qr_image.save(image_path)
    
    return image_filename

