import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const PixelArtEditor = ({ onArtSaved }) => {
    const [gridSize, setGridSize] = useState(50);
    const [grid, setGrid] = useState(Array(50).fill().map(() => Array(50).fill('#FFFFFF')));
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [brushSize, setBrushSize] = useState(1);
    const [tool, setTool] = useState('brush');
    const gridRef = useRef(null);
    const startCoord = useRef(null);

    const handleMouseDown = (rowIndex, colIndex) => {
        setIsMouseDown(true);
        startCoord.current = { rowIndex, colIndex };
        handleCellClick(rowIndex, colIndex);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
        startCoord.current = null;
    };

    const handleMouseMove = (rowIndex, colIndex) => {
        if (isMouseDown) {
            handleCellClick(rowIndex, colIndex);
        }
    };

    const handleCellClick = (rowIndex, colIndex) => {
        if (tool === 'brush') {
            const newGrid = grid.map((row, rIdx) => (
                row.map((cell, cIdx) => {
                    if (
                        rIdx >= rowIndex - Math.floor(brushSize / 2) &&
                        rIdx <= rowIndex + Math.floor(brushSize / 2) &&
                        cIdx >= colIndex - Math.floor(brushSize / 2) &&
                        cIdx <= colIndex + Math.floor(brushSize / 2)
                    ) {
                        return selectedColor;
                    }
                    return cell;
                })
            ));
            setGrid(newGrid);
        } else if (tool === 'rectangle' && startCoord.current) {
            const { rowIndex: startRow, colIndex: startCol } = startCoord.current;
            const newGrid = grid.map((row, rIdx) => (
                row.map((cell, cIdx) => {
                    if (
                        rIdx >= Math.min(startRow, rowIndex) &&
                        rIdx <= Math.max(startRow, rowIndex) &&
                        cIdx >= Math.min(startCol, colIndex) &&
                        cIdx <= Math.max(startCol, colIndex)
                    ) {
                        return selectedColor;
                    }
                    return cell;
                })
            ));
            setGrid(newGrid);
        }
    };

    const handleSave = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');

        const cellSize = 1080 / gridSize;
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

    const handleGridSizeChange = (event) => {
        const newSize = parseInt(event.target.value);
        setGridSize(newSize);
        setGrid(Array(newSize).fill().map(() => Array(newSize).fill('#FFFFFF')));
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                cursor.style.left = `${e.clientX - cursor.offsetWidth / 2}px`;
                cursor.style.top = `${e.clientY - cursor.offsetHeight / 2}px`;
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [brushSize]);

    return (
        <div>
            <h2>Pixel Art Editor</h2>
            <div>
                <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} />
                <button onClick={handleSave}>Save Pixel Art</button>
                <select onChange={handleGridSizeChange} value={gridSize}>
                    <option value={50}>50x50</option>
                    <option value={100}>100x100</option>
                    <option value={36}>36x36</option>
                </select>
            </div>
            <div className="tools">
                <label>
                    Brush Size:
                    <input
                        type="number"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        min="1"
                        max={Math.min(gridSize, gridSize)}
                    />
                </label>
                <button onClick={() => setTool('brush')}>Brush</button>
                <button onClick={() => setTool('rectangle')}>Rectangle</button>
            </div>
            <div
                ref={gridRef}
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridSize}, ${1080 / gridSize}px)`,
                    cursor: tool === 'brush' ? 'none' : 'default'
                }} // Adjust the cell size here
                onMouseLeave={handleMouseUp}
            >
                {grid.map((row, rowIndex) => (
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            style={{
                                width: `${1080 / gridSize}px`, // Adjust the cell size here
                                height: `${1080 / gridSize}px`, // Adjust the cell size here
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
            {tool === 'brush' && (
                <div className="cursor" style={{
                    position: 'absolute',
                    width: `${brushSize * (1080 / gridSize)}px`,
                    height: `${brushSize * (1080 / gridSize)}px`,
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.2)',
                    pointerEvents: 'none',
                    zIndex: 1000
                }}></div>
            )}
        </div>
    );
};

export default PixelArtEditor;
