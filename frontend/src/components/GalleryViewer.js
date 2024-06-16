import React from 'react';

const GalleryViewer = ({ gallery }) => {
    return (
        <div>
            <h2>Gallery Viewer</h2>
            <div className="gallery">
                {gallery.map(art => (
                    <div key={art.id} className="gallery-item">
                        <img src={art.imageUrl} alt="Pixel Art" />
                        <button onClick={() => handleDelete(art.id)} className="delete-button">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryViewer;
