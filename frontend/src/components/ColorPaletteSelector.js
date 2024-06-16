import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ColorPaletteSelector = ({ onSelectPalette }) => {
    const [palettes, setPalettes] = useState([]);

    useEffect(() => {
        const fetchPalettes = async () => {
            try {
                const response = await axios.get('/api/palettes');
                setPalettes(response.data);
            } catch (error) {
                console.error('Error fetching palettes:', error);
            }
        };

        fetchPalettes();
    }, []);

    return (
        <div>
            <h2>Color Palette Selector</h2>
            <div>
                {palettes.map(palette => (
                    <button key={palette.id} onClick={() => onSelectPalette(palette.colors)}>
                        {palette.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ColorPaletteSelector;
