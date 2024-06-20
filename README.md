
# PixelArt Editor

PixelArt Editor is a web-based application that allows users to create pixel art, save their creations, and manage a gallery of their artwork. The editor provides tools such as brush, rectangle, and circle tools for versatile drawing capabilities.


## Features

- Draw pixel art using brush, rectangle, and circle tools
- Adjustable brush sizes
- Save artwork to a gallery
- Delete artwork from the gallery
- Dynamic canvas size adjustments
- Enhanced color picker for selecting colors


## Tech Stack

**Client:** React, React-Color, React-Icons

**Server:** Flask, SQLAlchemy


**Database:** SQLite


## Installation

Backend Setup  
- Clone the repository:

```bash
  git clone https://github.com/Bonziman/PixelPalette.git
  cd PixelPalette/backend
```
- Create and activate a virtual environment:  
```bash
  python -m venv venv
  source venv/bin/activate
```
- Install the backend dependencies:

```bash
  pip install -r requirements.txt
```
- Run the Flask server:
```bash
  flask run
```
Frontend Setup 

- Navigate to the frontend directory:
```bash
  cd ../frontend
```
- Install the frontend dependencies:
```bash
  npm install
```
- Start the React development server:
```bash
  npm start
```
- Open your browser and navigate to http://localhost:3000 to use the PixelArt Editor.



    
## Usage/Examples

- Select a tool from the toolbar (Brush, Rectangle, Circle).
- Choose a color using the color picker.
- Adjust the brush size if needed.
- Draw on the canvas.
- Save your artwork to the gallery.
- Manage your gallery by deleting unwanted artwork.


## Contributing

Contributions are always welcome!

If you would like to contribute to this project, please follow these steps:

- Fork the repository.
- Create a new branch (git checkout -b feature-branch).
- Make your changes and commit them (git commit -m 'Add new feature').
- Push to the branch (git push origin feature-branch).
- Open a Pull Request.


## License

This project is licensed under the MIT License.


## Authors

- [@Aymane Eloirdiwi](https://www.github.com/Bonziman)

