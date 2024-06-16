#!/usr/bin/python3
from app import app, db


class PixelArt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

class ColorPalette(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    colors = db.Column(db.Text, nullable=False)

# create the databes and tables
with app.app_context():
    db.create_all()
