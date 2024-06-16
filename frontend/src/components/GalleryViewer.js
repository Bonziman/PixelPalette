import React from 'react';
import axios from 'axios';

const GalleryViewer = ({ gallery, fetchGallery }) => {

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this pixel art?');
        if (!confirmed) return;

        try {
            const response = await axios.delete(`/api/delete/${id}`);
            if (response.status === 200) {
                fetchGallery(); // Fetch the updated gallery after deletion
            }
        } catch (error) {
            console.error('Error deleting pixel art:', error);
        }
    };

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
