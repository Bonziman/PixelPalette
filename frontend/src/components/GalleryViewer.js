import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GalleryViewer = () => {
    const [gallery, setGallery] = useState([]);

    useEffect(() => {
        const fetchGallery = async () => {
            const response = await axios.get('/api/gallery');
            setGallery(response.data);
        };

        fetchGallery();
    }, []);

    return (
        <div>
            <h2>Gallery Viewer</h2>
            <div>
                {gallery.map(art => (
                    <div key={art.id}>
                        <img src={art.imageUrl} alt="Pixel Art" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GalleryViewer;
