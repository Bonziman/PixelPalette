import React from 'react';
import { FaBrush, FaSquare, FaCircle } from 'react-icons/fa';
import { colors } from './theme';

const Toolbar = ({ tool, setTool, brushSize, setBrushSize }) => (
    <div className="tools" style={{ backgroundColor: colors.light, padding: '10px' }}>
        <label>
            Brush Size:
            <input
                type="number"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                min="1"
                max="100"
                style={{ margin: '0 10px' }}
            />
        </label>
        <button onClick={() => setTool('brush')} style={{ backgroundColor: tool === 'brush' ? colors.primary : colors.light }}>
            <FaBrush />
        </button>
        <button onClick={() => setTool('rectangle')} style={{ backgroundColor: tool === 'rectangle' ? colors.primary : colors.light }}>
            <FaSquare />
        </button>
        <button onClick={() => setTool('circle')} style={{ backgroundColor: tool === 'circle' ? colors.primary : colors.light }}>
            <FaCircle />
        </button>
    </div>
);

export default Toolbar;
