import React, { useState } from 'react';

const PixelArtEditor = () => {
    const [grid, setGrid] = useState(Array(32).fill(Array(32).fill('#FFFFFF')));

    const handleCellClick = (rowIndex, colIndex) => {
        const newGrid = grid.map((row, rIdx) => (
            row.map((cell, cIdx) => (
                rIdx === rowIndex && cIdx === colIndex ? '#000000' : cell
            ))
        ));
        setGrid(newGrid);
    };

    return (
        <div>
            <h2>Pixel Art Editor</h2>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(32, 20px)` }}>
                {grid.map((row, rowIndex) => (
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: cell,
                                border: '1px solid #ddd'
                            }}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                        ></div>
                    ))
                ))}
            </div>
        </div>
    );
};

export default PixelArtEditor;

