import React from 'react';

const ColorPaletteSelector = ({ palettes, onSelectPalette }) => {
    return (
        <div>
            <h2>Color Palette Selector</h2>
            <div>
                {palettes.map(palette => (
                    <button key={palette.id} onClick={() => onSelectPalette(palette)}>
                        {palette.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ColorPaletteSelector;
