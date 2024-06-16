import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import PixelArtEditor from './components/PixelArtEditor';
import PixelArtViewer from './components/PixelArtViewer';
import ColorPaletteSelector from './components/ColorPaletteSelector';
import GalleryViewer from './components/GalleryViewer';
import axios from 'axios';

function App() {
    const [imageUrl, setImageUrl] = useState('');
    const [gallery, setGallery] = useState([]);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const response = await axios.get('/api/gallery');
            setGallery(response.data);
        } catch (error) {
            console.error('Error fetching gallery:', error);
        }
    };

    const handleArtSaved = () => {
        fetchGallery();
    };

    return (
        <div>
            <h1>PixelPalette</h1>
            <FileUpload setImageUrl={setImageUrl} />
            <PixelArtEditor onArtSaved={handleArtSaved} />
            <PixelArtViewer imageUrl={imageUrl} />
            <ColorPaletteSelector palettes={[]} onSelectPalette={() => {}} />
            <GalleryViewer gallery={gallery} fetchGallery={fetchGallery} />
        </div>
    );
}

export default App;
