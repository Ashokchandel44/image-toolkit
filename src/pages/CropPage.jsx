import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import useImageFile from '../hooks/useImageFile';
import ToolPageShell from '../components/ToolPageShell';
import FileUpload from '../components/FileUpload';
import ToolOptionsPanel from '../components/ToolOptionsPanel';
import ResultPreview from '../components/ResultPreview';
import DownloadButton from '../components/DownloadButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import { blobToDataUrl, cropImage, saveBlobWithName } from '../utils/imageProcessing';

function CropPage() {
  const { file, previewUrl, setFile, error, setError } = useImageFile();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  async function handleCrop() {
    if (!previewUrl || !croppedAreaPixels) {
      setError('Upload an image and choose a crop area first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const blob = await cropImage(previewUrl, croppedAreaPixels, file.type || 'image/png');
      const preview = await blobToDataUrl(blob);
      setResult({ blob, preview });
      setSuccess('Crop complete. Review the cropped preview and download it when ready.');
    } catch (processingError) {
      setError(processingError.message || 'Unable to crop the image.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="Free Image Cropper Online"
      seoTitle="Free Image Cropper Online | Crop Images in Browser"
      description="Crop images online for free directly in your browser. Select custom size, crop area, and download the final image instantly."
      canonical="https://travelwithanki.com/image-toolkit/image-cropper/"
      intro="Crop images online with an interactive browser-based crop area and download the final image instantly."
      seoContent={{
        whatItDoes: 'This image cropper lets you select a specific crop region and export just that portion of the image.',
        howToUse: 'Upload an image, drag and zoom the crop area to frame the content you want, then export the cropped result.',
        whyUseful: 'Cropping helps remove distractions, improve composition, and create image sizes that fit social posts or layouts better.',
      }}
      faqItems={[
        { question: 'Can I preview the cropped result before downloading?', answer: 'Yes. The app renders a processed preview after you apply the crop.' },
        { question: 'Does the crop happen locally?', answer: 'Yes. The crop runs in your browser using canvas-based processing.' },
      ]}
    >
      <div className="tool-main">
        <FileUpload onChange={(event) => { setFile(event.target.files?.[0] || null); setResult(null); }} />
        <div className="panel crop-panel">
          <div className="crop-area">
            {previewUrl ? (
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
              />
            ) : (
              <p className="empty-state">Upload an image to start cropping.</p>
            )}
          </div>
        </div>
        <ToolOptionsPanel title="Crop controls" actions={<button className="button" type="button" onClick={handleCrop} disabled={loading}>Apply Crop</button>}>
          <label className="field">
            <span>Zoom</span>
            <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
          </label>
        </ToolOptionsPanel>
        {loading ? <LoadingSpinner label="Cropping image..." /> : null}
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
      </div>
      <div className="tool-sidebar">
        <ResultPreview src={result?.preview}>
          <DownloadButton onClick={() => saveBlobWithName(result.blob, file.name, 'cropped', result.blob.type)} disabled={!result} />
        </ResultPreview>
      </div>
    </ToolPageShell>
  );
}

export default CropPage;
