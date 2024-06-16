#!/usr/bin/python3
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from PIL import Image
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pixelpalette.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

import models

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
        # Process the image with PIL (simplified for MVP)
        image = Image.open(filepath)
        pixel_art = image.resize((32, 32), Image.NEAREST)
        pixel_art.save(filepath)
        return jsonify({'pixelArtUrl': filepath}), 201

@app.route('/api/create', methods=['POST'])
def create_pixel_art():
    data = request.json
    new_art = models.PixelArt(image_url=data['image_url'])
    db.session.add(new_art)
    db.session.commit()
    return jsonify({'message': 'Pixel art created', 'id': new_art.id}), 201

@app.route('/api/palettes', methods=['GET'])
def get_palettes():
    palettes = models.ColorPalette.query.all()
    return jsonify([{'id': p.id, 'name': p.name, 'colors': p.colors} for p in palettes])

@app.route('/api/save', methods=['POST'])
def save_pixel_art():
    data = request.json
    new_art = models.PixelArt(image_url=data['image_url'])
    db.session.add(new_art)
    db.session.commit()
    return jsonify({'message': 'Pixel art saved', 'id': new_art.id}), 201

if __name__ == '__main__':
    app.run(debug=True)
