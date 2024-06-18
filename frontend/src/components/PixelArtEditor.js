import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { SketchPicker } from 'react-color';
import { FaBrush, FaSquare, FaCircle } from 'react-icons/fa';
import { colors } from './theme';

const PixelArtEditor = ({ onArtSaved }) => {
    const [gridSize, setGridSize] = useState(50);
    const [grid, setGrid] = useState(Array(50).fill().map(() => Array(50).fill(colors.white)));
    const [selectedColor, setSelectedColor] = useState(colors.black);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [brushSize, setBrushSize] = useState(1);
    const [tool, setTool] = useState('brush');
    const [cursorVisible, setCursorVisible] = useState(false);
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
        if (tool === 'brush' || tool === 'circle') {
            const newGrid = grid.map((row, rIdx) => (
                row.map((cell, cIdx) => {
                    const distance = Math.sqrt(Math.pow(rIdx - rowIndex, 2) + Math.pow(cIdx - colIndex, 2));
                    if ((tool === 'brush' && distance <= Math.floor(brushSize / 2)) ||
                        (tool === 'circle' && distance <= brushSize)) {
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
        setGrid(Array(newSize).fill().map(() => Array(newSize).fill(colors.white)));
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                cursor.style.left = `${e.clientX + window.scrollX}px`;
                cursor.style.top = `${e.clientY + window.scrollY}px`;
            }
        };

        const handleMouseEnter = () => setCursorVisible(true);
        const handleMouseLeave = () => setCursorVisible(false);

        document.addEventListener('mousemove', handleMouseMove);
        if (gridRef.current) {
            gridRef.current.addEventListener('mouseenter', handleMouseEnter);
            gridRef.current.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (gridRef.current) {
                gridRef.current.removeEventListener('mouseenter', handleMouseEnter);
                gridRef.current.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [brushSize]);

    useEffect(() => {
        const cursor = document.querySelector('.cursor');
        if (tool === 'brush' && cursor) {
            cursor.style.width = `${brushSize * (1080 / gridSize)}px`;
            cursor.style.height = `${brushSize * (1080 / gridSize)}px`;
            cursor.style.marginLeft = `-${(brushSize * (1080 / gridSize)) / 2}px`;
            cursor.style.marginTop = `-${(brushSize * (1080 / gridSize)) / 2}px`;
        }
    }, [tool, brushSize, gridSize]);

    const cellSize = 1080 / gridSize; // Adjust the cell size here
    const gridWidth = gridSize * cellSize;

    return (
        <div>
            <h2>Pixel Art Editor</h2>
            <div>
                <SketchPicker color={selectedColor} onChangeComplete={(color) => setSelectedColor(color.hex)} />
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
                <button onClick={() => setTool('brush')}><FaBrush /></button>
                <button onClick={() => setTool('rectangle')}><FaSquare /></button>
                <button onClick={() => setTool('circle')}><FaCircle /></button>
            </div>
            <div
                ref={gridRef}
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
                    cursor: tool === 'brush' ? 'none' : 'default',
                    width: `${gridWidth}px`, // Adjust the width to match the grid width
                    margin: '0 auto' // Center the grid
                }}
                onMouseLeave={handleMouseUp}
            >
                {grid.map((row, rowIndex) => (
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            style={{
                                width: `${cellSize}px`, // Adjust the cell size here
                                height: `${cellSize}px`, // Adjust the cell size here
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
            {tool === 'brush' && cursorVisible && (
                <div className="cursor" style={{
                    position: 'absolute',
                    width: `${brushSize * cellSize}px`,
                    height: `${brushSize * cellSize}px`,
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.2)',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    transform: 'translate(-50%, -50%)',
                    display: cursorVisible ? 'block' : 'none'
                }}></div>
            )}
        </div>
    );
};

export default PixelArtEditor;
