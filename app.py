


import os
import threading
import json
from flask import Flask, request, render_template, send_file, redirect, url_for, send_from_directory, make_response, flash, jsonify
from modules.foodIdent_module.foodIdent import load_and_prep_image, pred_and_plot, load_model
from werkzeug.utils import secure_filename
from modules.foodIdent_module.foodIdentVideo import start_camera, stop_camera, process_video
from modules.bot_module.bot import get_bot_response
from modules.scan_module.gen import generate_qr_code # ,generate_barcode
from modules.scan_module.decoder import decode_qr_code # ,decode_barcode
#from modules.scan_module.forms import BarcodeForm
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

 
json_file_path = 'modules/foodIdent_module/classes.json'
with open(json_file_path, 'r') as json_file:
    data = json.load(json_file)
class_names = data.get('class_names', [])


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'} 
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


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



@app.route('/get_response', methods=['POST'])
def get_response():
    # Get the user input from the JSON request data
    user_input = request.json.get('user_input')
    
    # Check if a valid user input exists
    if user_input:
        # Get a response from the bot based on the user input
        response = get_bot_response(user_input)
        
        # Create a JSON response containing the bot's response
        response_data = {'response': response}
        
        # Return the JSON response with a 200 status code and proper content type
        return jsonify(response_data), 200, {'Content-Type': 'application/json; charset=utf-8'}

    # If no valid input is provided, return an error JSON response
    return jsonify({'error': 'Invalid input'})



@app.route('/generate_qr_code', methods=['POST'])
def generate_qr_code_route():
    # Extract data from the form submitted in the request
    data = {
        "name": request.form['name'],
        "price": request.form['price'],
        "kcal": request.form['kcal'],
        "fat": request.form['fat'],
        "carbs": request.form['carbs'],
        "protein": request.form['protein'],
        "category": request.form['category'],
        "amount": request.form['amount'],
        "date": request.form['date']
    }
    
    # Generate a QR code image based on the extracted data and save it to the designated folder
    qr_code_image_filename = generate_qr_code(data, app.config['QR_CODE_FOLDER'])
    
    # Get the URL for the generated QR code image in the 'static' folder
    qr_code_image_url = url_for('static', filename='qrcodes/' + qr_code_image_filename)

    # Flash a success message to be displayed in the application
    flash("QR Code generated successfully!")

    # Redirect back to the 'index' route after generating the QR code
    return redirect(url_for('index'))

@app.route('/decode_qr_code', methods=['POST'])
def decode_qr_code_route():
    # Check if the 'qr_code_image' file is present in the request
    if 'qr_code_image' not in request.files:
        flash('No file part', 'error')
        return redirect(request.url)

    # Get the file from the request
    file = request.files['qr_code_image']

    # Check if no file is selected
    if file.filename == '':
        flash('No selected file', 'error')
        return redirect(request.url)

    # Check if the selected file has an allowed file extension
    if file and allowed_file(file.filename):
        # Securely save the uploaded file to the designated folder
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['QR_CODE_FOLDER'], filename)
        file.save(file_path)

        # Attempt to decode the QR code from the saved image
        decoded_data = decode_qr_code(file_path)
        
        if decoded_data:
            # Flash a success message and return the decoded data
            flash("QR Code decoded successfully!", "success")
            return f"Decoded QR Code Data: {decoded_data}"
            #results = {"QR Code decoded successfully!", "success"}
            #return jsonify(results)
        else:
            # Flash an error message and redirect back to the upload page
            flash("Failed to decode QR Code.", "error")
            return redirect(request.url)
            #results = {"QR Code decoded successfully!", "success"}
            #return jsonify(results)
    else:
        # Flash an error message for invalid file type and redirect
        flash('Invalid file type. Please upload an image file.', 'error')
        return redirect(request.url)
        #results = {'Invalid file type. Please upload an image file.', 'error'}
        #return jsonify(results)




camera_thread = None
@app.route('/start_food_identification', methods=['POST'])
def start_food_identification_route():
    # Create a new thread to start the food identification process concurrently
    camera_thread = threading.Thread(target=foodIdent)
    
    # Start the camera thread
    camera_thread.start()
    
    # Redirect back to the 'index' route after starting the food identification
    return redirect(url_for('index'))

# Route for video streaming
@app.route('/video_feed')
def video_feed():
    # Return a Response object with the generator function 'generate_frames'
    # This response will stream video frames in a multipart format
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start_camera_monitoring', methods=['POST'])
def start_camera_monitoring_route():
    global camera_thread

    # Check if the camera thread does not exist or is not alive
    if camera_thread is None or not camera_thread.is_alive():
        # Start the camera monitoring in a new thread
        camera_thread = threading.Thread(target=generate_frames)
        camera_thread.start()

    # Redirect to the 'display_video' route after starting the camera monitoring
    return redirect(url_for('display_video'))


@app.route('/display_video')
def display_video():
    # Render a template that will display the video
    return render_template('display_video.html')


@app.route('/upload_image', methods=['GET', 'POST'])
def upload_predict():
    # Check if the request method is POST
    if request.method == 'POST':
        # Check if 'file' is in the request files
        if 'file' not in request.files:
            flash('No file part', 'error')
            return redirect(request.url)

        # Get the file from the request
        file = request.files['file']

        # Check if no file is selected
        if file.filename == '':
            flash('No selected file', 'error')
            return redirect(request.url)

        # Check if the selected file has an allowed file extension
        if file and allowed_file(file.filename):
            # Securely save the uploaded file to the designated upload folder
            filename = secure_filename(file.filename)
            upload_folder = 'static/uploads/'
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)

            # Make a prediction using the uploaded image
            pred_class = pred_and_plot(model, file_path, class_names)

            # Generate the URL for the saved image
            image_url = url_for('static', filename='uploads/' + filename)

            # Render the result template with the prediction and image URL
            return render_template('result.html', prediction=pred_class, image_file=image_url)
        else:
            # Flash an error message for an invalid file type and redirect
            flash('Invalid file type. Please upload an image file.', 'error')
            return redirect(request.url)

    # Render the index template for GET requests
    return render_template('index.html')

# 4 routes for video food identification
@app.route('/stream_camera')
def stream_camera():
    return Response(process_video(), mimetype='multipart/x-mixed-replace; boundary=frame')

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




if __name__ == '__main__':
    app.run(debug=True)