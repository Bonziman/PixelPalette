import React from 'react';
import { SketchPicker } from 'react-color';

const ColorPicker = ({ selectedColor, setSelectedColor }) => (
    <div style={{ margin: '10px 0' }}>
        <SketchPicker color={selectedColor} onChangeComplete={(color) => setSelectedColor(color.hex)} />
    </div>
);

export default ColorPicker;
