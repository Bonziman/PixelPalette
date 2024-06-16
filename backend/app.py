#!/usr/bin/python3
#!/usr/bin/python3
from flask import Flask, request, jsonify, send_from_directory
from PIL import Image
import os
from models import db, PixelArt, ColorPalette  # Import models
import base64
from io import BytesIO
import time

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pixelpalette.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)  # Initialize db with app

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def home():
    return "Hello, PixelPalette!"

@app.route('/api/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        # Process the image with PIL
        image = Image.open(filepath)
        pixel_art = image.resize((64, 64), Image.BICUBIC)  # Using BICUBIC for better quality
        pixel_art_filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'pixel_' + file.filename)
        pixel_art.save(pixel_art_filepath)
        return jsonify({'pixelArtUrl': '/uploads/' + 'pixel_' + file.filename}), 201
    
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/create', methods=['POST'])
def create_pixel_art():
    data = request.json
    new_art = PixelArt(image_url=data['image_url'])
    db.session.add(new_art)
    db.session.commit()
    return jsonify({'message': 'Pixel art created', 'id': new_art.id}), 201

@app.route('/api/palettes', methods=['GET'])
def get_palettes():
    palettes = [
        {'id': 1, 'name': 'Warm', 'colors': ['#FF5733', '#FFBD33', '#DBFF33']},
        {'id': 2, 'name': 'Cool', 'colors': ['#33FFBD', '#33D1FF', '#3371FF']}
    ]
    return jsonify(palettes), 200

@app.route('/api/save', methods=['POST'])
def save_pixel_art():
    data = request.json
    image_data = data['image'].split(',')[1]
    image = Image.open(BytesIO(base64.b64decode(image_data)))
    filename = f"pixel_art_{int(time.time())}.png"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    image.save(filepath)
    
    new_art = PixelArt(image_url=f"/uploads/{filename}")
    db.session.add(new_art)
    db.session.commit()
    return jsonify({'message': 'Pixel art saved', 'id': new_art.id}), 201

@app.route('/api/gallery', methods=['GET'])
def get_gallery():
    pixel_arts = PixelArt.query.all()
    return jsonify([{'id': art.id, 'imageUrl': art.image_url} for art in pixel_arts]), 200

@app.route('/api/delete/<int:id>', methods=['DELETE'])
def delete_pixel_art(id):
    art = PixelArt.query.get(id)
    if art:
        try:
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], os.path.basename(art.image_url))
            if os.path.exists(filepath):
                os.remove(filepath)
        except Exception as e:
            return jsonify({'error': f'Error deleting file: {str(e)}'}), 500
        db.session.delete(art)
        db.session.commit()
        return jsonify({'message': 'Pixel art deleted'}), 200
    else:
        return jsonify({'error': 'Pixel art not found'}), 404

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure tables are created
    app.run(debug=True)
