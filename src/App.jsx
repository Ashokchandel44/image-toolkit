import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CompressPage from './pages/CompressPage';
import ResizePage from './pages/ResizePage';
import CropPage from './pages/CropPage';
import RotatePage from './pages/RotatePage';
import ConvertPage from './pages/ConvertPage';
import WatermarkPage from './pages/WatermarkPage';
import AdjustmentsPage from './pages/AdjustmentsPage';
import MetadataPage from './pages/MetadataPage';
import Base64EncodePage from './pages/Base64EncodePage';
import Base64DecodePage from './pages/Base64DecodePage';
import SocialResizePage from './pages/SocialResizePage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/compress-image" element={<CompressPage />} />
        <Route path="/resize-image" element={<ResizePage />} />
        <Route path="/crop-image" element={<CropPage />} />
        <Route path="/rotate-image" element={<RotatePage />} />
        <Route path="/convert-image" element={<ConvertPage />} />
        <Route path="/watermark-image" element={<WatermarkPage />} />
        <Route path="/adjust-image" element={<AdjustmentsPage />} />
        <Route path="/image-to-base64" element={<Base64EncodePage />} />
        <Route path="/base64-to-image" element={<Base64DecodePage />} />
        <Route path="/remove-image-metadata" element={<MetadataPage />} />
        <Route path="/resize-image-for-instagram" element={<SocialResizePage presetKey="instagram-post" />} />
        <Route path="/resize-image-for-youtube-thumbnail" element={<SocialResizePage presetKey="youtube-thumbnail" />} />
        <Route path="/resize-image-for-social-media" element={<SocialResizePage presetKey="instagram-post" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
