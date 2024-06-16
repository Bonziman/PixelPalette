import React, { useState, useRef } from 'react';
import axios from 'axios';

const PixelArtEditor = ({ onArtSaved }) => {
    const [grid, setGrid] = useState(Array(50).fill().map(() => Array(50).fill('#FFFFFF')));
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [isMouseDown, setIsMouseDown] = useState(false);
    const gridRef = useRef(null);

    const handleMouseDown = (rowIndex, colIndex) => {
        setIsMouseDown(true);
        handleCellClick(rowIndex, colIndex);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    const handleMouseMove = (rowIndex, colIndex) => {
        if (isMouseDown) {
            handleCellClick(rowIndex, colIndex);
        }
    };

    const handleCellClick = (rowIndex, colIndex) => {
        const newGrid = grid.map((row, rIdx) => (
            row.map((cell, cIdx) => (
                rIdx === rowIndex && cIdx === colIndex ? selectedColor : cell
            ))
        ));
        setGrid(newGrid);
    };

    const handleSave = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');

        const cellSize = 1080 / 50;
        const overlap = 0.5; // Slight overlap to avoid thin lines

        grid.forEach((row, rowIndex) => {
            row.forEach((color, colIndex) => {
                ctx.fillStyle = color;
                ctx.fillRect(colIndex * cellSize - overlap, rowIndex * cellSize - overlap, cellSize + overlap, cellSize + overlap);
            });
        });

        const dataUrl = canvas.toDataURL('image/png');
        const response = await axios.post('/api/save', { image: dataUrl });
        console.log('Pixel art saved', response.data);

        if (onArtSaved) {
            onArtSaved();
        }
    };

    return (
        <div>
            <h2>Pixel Art Editor</h2>
            <div>
                <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} />
                <button onClick={handleSave}>Save Pixel Art</button>
            </div>
            <div
                ref={gridRef}
                style={{ display: 'grid', gridTemplateColumns: `repeat(50, 20px)` }} // Adjust the cell size here
                onMouseLeave={handleMouseUp}
            >
                {grid.map((row, rowIndex) => (
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            style={{
                                width: '20px', // Adjust the cell size here
                                height: '20px', // Adjust the cell size here
                                backgroundColor: cell,
                                border: '1px solid #ddd'
                            }}
                            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                            onMouseUp={handleMouseUp}
                            onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
                        ></div>
                    ))
                ))}
            </div>
        </div>
    );
};

export default PixelArtEditor;
