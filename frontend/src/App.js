import React from 'react';
import FileUpload from './components/FileUpload';
import PixelArtEditor from './components/PixelArtEditor';
import PixelArtViewer from './components/PixelArtViewer';
import ColorPaletteSelector from './components/ColorPaletteSelector';
import GalleryViewer from './components/GalleryViewer';

function App() {
  return (
    <div>
      <h1>PixelPalette</h1>
      <FileUpload />
      <PixelArtEditor />
      <PixelArtViewer />
      <ColorPaletteSelector palettes={[]} onSelectPalette={() => {}} />
      <GalleryViewer />
    </div>
  );
}

export default App;
