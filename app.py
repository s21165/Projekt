import os
import threading
from flask import Flask, request, render_template, send_file, redirect, url_for, send_from_directory, make_response
from flask import Flask, Response, request, render_template, redirect, url_for, make_response

from flask import Flask, request, render_template, url_for
from modules.foodIdent_module.foodIdent import load_and_prep_image, pred_and_plot, load_model


from modules.foodIdent_module.foodIdentVideo import start_camera, stop_camera

from modules.bot_module.bot import get_bot_response
from modules.scan_module.gen import generate_qr_code # ,generate_barcode
#from modules.scan_module.forms import BarcodeForm
from modules.scan_module.decoder import decode_qr_code # ,decode_barcode
from modules.advert_module.monitor import generate_frames

import sys

app = Flask(__name__)
app.config['BARCODE_FOLDER'] = os.path.join(app.static_folder, 'barcodes')
app.config['QR_CODE_FOLDER'] = os.path.join(app.static_folder, 'qrcodes')  
app.config['SECRET_KEY'] = 'key'  # Replace with a strong secret key
#app.config['BARCODE_FOLDER'] = 'static/barcodes

# Loading model
model = load_model('model3.h5')
print("Model loaded successfully:", model is not None)

class_names = ['ciasto_czekoladowe', 'donut', 'frytki', 'hamburger', 'lasagne', 'makaroniki',
 'nalesniki', 'pizza', 'salatka_cezar', 'skrzydelka_z_kurczaka', 'sushi',
 'szarlotka', 'tatar', 'tiramisu', 'zeberka']

@app.route('/', methods=['GET', 'POST'])
def index():
    bot_response = ""
    #barcode_form = BarcodeForm()  # For barcode form
    if request.method == 'POST':
        user_input = request.form['user_input']
        bot_response = get_bot_response(user_input)
    response = make_response(render_template('index.html', bot_response=bot_response, ))
    response.headers['Content-Type'] = 'text/html; charset=utf-8'
    return response


from flask import jsonify

@app.route('/get_response', methods=['POST'])
def get_response():
    user_input = request.json.get('user_input')
    if user_input:
        response = get_bot_response(user_input)
        response_data = {'response': response}
        return jsonify(response_data), 200, {'Content-Type': 'application/json; charset=utf-8'}

    return jsonify({'error': 'Invalid input'})


@app.route('/generate_qr_code', methods=['POST'])
def generate_qr_code_route():
    data = {
        "name": request.form['name'],
        "price": request.form['price'],
        "kcal": request.form['kcal'],
        "fat": request.form['fat'],
        "carbs": request.form['carbs'],
        "protein": request.form['protein'],
        "category": request.form['category'],
        "amount": request.form['amount']
    }
    
    qr_code_image_filename = generate_qr_code(data, app.config['QR_CODE_FOLDER'])
    qr_code_image_path = os.path.join(app.config['QR_CODE_FOLDER'], qr_code_image_filename)
    return send_file(qr_code_image_path, mimetype='image/png')

# @app.route('/generate_barcode', methods=['POST'])
# def generate_barcode_route():
    # if request.method == 'POST':
        # data = {
            # "name": request.form['name'],
            # "price": request.form['price'],
            # "kcal": request.form['kcal'],
            # "fat": request.form['fat'],
            # "carbs": request.form['carbs'],
            # "protein": request.form['protein'],
            # "category": request.form['category'],
            # "amount": request.form['amount']
        # }
        # barcode_image_filename = generate_barcode(data, app.config['BARCODE_FOLDER'])
        # barcode_image_path = os.path.join(app.config['BARCODE_FOLDER'], barcode_image_filename)
        # return send_file(barcode_image_path, mimetype='image/png', as_attachment=True)

# @app.route('/decode_barcode', methods=['POST'])
# def decode_barcode_route():
    # if 'barcode_image' not in request.files:
        # return "No barcode image uploaded"
    
    # barcode_image = request.files['barcode_image']
    # if barcode_image.filename == '':
        # return "No selected file"
    
    # barcode_image_path = os.path.join(app.config['BARCODE_FOLDER'], barcode_image.filename)
    # barcode_image.save(barcode_image_path)
    
    # decoded_data = decode_barcode(barcode_image_path)
    
    # return f"Decoded Barcode Data: {decoded_data}"

@app.route('/decode_qr_code', methods=['POST'])
def decode_qr_code_route():
    if 'qr_code_image' not in request.files:
        return "No QR code image uploaded"
    
    qr_code_image = request.files['qr_code_image']
    if qr_code_image.filename == '':
        return "No selected file"
    
    qr_code_image_path = os.path.join(app.config['QR_CODE_FOLDER'], qr_code_image.filename)
    qr_code_image.save(qr_code_image_path)
    
    decoded_data = decode_qr_code(qr_code_image_path)
    return f"Decoded QR Code Data: {decoded_data}"
    


@app.route('/start_food_identification', methods=['POST'])
def start_food_identification_route():
    camera_thread = threading.Thread(target=foodIdent)
    camera_thread.start()
    return redirect(url_for('index'))



# Route for video streaming
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


camera_thread = None
# Remove the start_camera_monitoring route
# Replace it with a route that redirects to a page where the video is displayed
@app.route('/start_camera_monitoring', methods=['POST'])
def start_camera_monitoring_route():
    global camera_thread

    if camera_thread is None or not camera_thread.is_alive():
        # Start the camera monitoring in a new thread
        camera_thread = threading.Thread(target=generate_frames)
        camera_thread.start()

    return redirect(url_for('display_video'))

@app.route('/display_video')
def display_video():
    # Render a template that will display the video
    return render_template('display_video.html')



@app.route('/upload_image', methods=['GET', 'POST'])
def upload_predict():
    if request.method == 'POST':
        # Get the file from post request
        file = request.files['file']

        # Define a directory to save the file (make sure this directory exists)
        upload_folder = 'static/uploads/'
        filename = upload_folder + file.filename
        file.save(filename)

        # Make prediction
        pred_class = pred_and_plot(model, filename, class_names)

        # Generate the URL for the saved image
        image_url = url_for('static', filename='uploads/' + file.filename)

        return render_template('result.html', prediction=pred_class, image_file=image_url)

    return render_template('upload.html')



@app.route('/camera_control', methods=['GET'])
def camera_control():
    return render_template('camera_control.html')

@app.route('/start_camera', methods=['POST'])
def start_camera_route():
    start_camera()
    return "Camera started."

@app.route('/stop_camera', methods=['POST'])
def stop_camera_route():
    stop_camera()
    return "Camera stopped."




if __name__ == '__main__':
    app.run(debug=True)