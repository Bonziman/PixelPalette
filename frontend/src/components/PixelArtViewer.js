import React from 'react';

const PixelArtViewer = ({ imageUrl }) => {
    return (
        <div>
            <h2>Pixel Art Viewer</h2>
            <img src={imageUrl} alt="Pixel Art" />
        </div>
    );
};

export default PixelArtViewer;
