import React from 'react';

const PixelArtViewer = ({ imageUrl }) => {
    return (
        <div>
            <h2>Pixel Art Viewer</h2>
            {imageUrl ? (
                <img src={imageUrl} alt="Pixel Art" />
            ) : (
                <p>No pixel art to display.</p>
            )}
        </div>
    );
};

export default PixelArtViewer;
