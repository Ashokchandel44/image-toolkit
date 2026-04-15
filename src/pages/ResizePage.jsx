import React, { useState } from 'react';
import useImageFile from '../hooks/useImageFile';
import ToolPageShell from '../components/ToolPageShell';
import FileUpload from '../components/FileUpload';
import ImagePreview from '../components/ImagePreview';
import ResultPreview from '../components/ResultPreview';
import ToolOptionsPanel from '../components/ToolOptionsPanel';
import DownloadButton from '../components/DownloadButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import { RESIZE_PRESETS } from '../utils/constants';
import { blobToDataUrl, loadImage, resizeImage, saveBlobWithName } from '../utils/imageProcessing';

function ResizePage() {
  const { file, fileInfo, previewUrl, setFile, error, setError } = useImageFile();
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [success, setSuccess] = useState('');

  async function syncDimensions(nextWidth, nextHeight, dimensionChanged) {
    if (!file || !keepAspectRatio) {
      if (dimensionChanged === 'width') setWidth(nextWidth);
      if (dimensionChanged === 'height') setHeight(nextHeight);
      return;
    }

    const image = await loadImage(previewUrl);
    const ratio = image.naturalWidth / image.naturalHeight;

    if (dimensionChanged === 'width') {
      setWidth(nextWidth);
      if (nextWidth) setHeight(String(Math.round(Number(nextWidth) / ratio)));
    }

    if (dimensionChanged === 'height') {
      setHeight(nextHeight);
      if (nextHeight) setWidth(String(Math.round(Number(nextHeight) * ratio)));
    }
  }

  function handlePresetChange(event) {
    const preset = RESIZE_PRESETS.find((item) => item.label === event.target.value);
    if (!preset) return;
    setWidth(preset.width ? String(preset.width) : '');
    setHeight(preset.height ? String(preset.height) : '');
  }

  async function handleResize() {
    if (!file || !width || !height) {
      setError('Please upload an image and enter both width and height.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const blob = await resizeImage(file, {
        width: Number(width),
        height: Number(height),
        mimeType: file.type || 'image/png',
      });
      const preview = await blobToDataUrl(blob);
      setResult({ blob, preview, dimensions: `${width} x ${height}` });
      setSuccess('Resize complete. The processed image is ready.');
    } catch (processingError) {
      setError(processingError.message || 'Unable to resize the image.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="Resize Image"
      description="Resize images online by custom dimensions or social media presets using high-quality browser-side scaling."
      seoContent={{
        whatItDoes: 'This tool changes image dimensions in the browser while preserving quality with client-side resizing.',
        howToUse: 'Upload an image, choose a preset or enter dimensions manually, keep aspect ratio if needed, then export the resized image.',
        whyUseful: 'Resizing helps images fit websites, social media posts, thumbnails, email layouts, and more without relying on server processing.',
      }}
      faqItems={[
        { question: 'Will resizing distort my image?', answer: 'Not if you keep aspect ratio on or use a preset that matches the intended output shape.' },
        { question: 'Are social media presets included?', answer: 'Yes. The app includes common presets such as Instagram, Facebook, YouTube, WhatsApp, X, and LinkedIn.' },
      ]}
    >
      <div className="tool-main">
        <FileUpload onChange={(event) => { setFile(event.target.files?.[0] || null); setResult(null); }} />
        <ToolOptionsPanel
          title="Resize settings"
          actions={<button className="button" type="button" onClick={handleResize} disabled={loading}>Resize Image</button>}
        >
          <label className="field">
            <span>Preset</span>
            <select defaultValue="Custom" onChange={handlePresetChange}>
              {RESIZE_PRESETS.map((preset) => (
                <option key={preset.label} value={preset.label}>{preset.label}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Width</span>
            <input type="number" min="1" value={width} onChange={(event) => syncDimensions(event.target.value, height, 'width')} />
          </label>
          <label className="field">
            <span>Height</span>
            <input type="number" min="1" value={height} onChange={(event) => syncDimensions(width, event.target.value, 'height')} />
          </label>
          <label className="checkbox-field">
            <input type="checkbox" checked={keepAspectRatio} onChange={(event) => setKeepAspectRatio(event.target.checked)} />
            <span>Keep aspect ratio</span>
          </label>
        </ToolOptionsPanel>
        {loading ? <LoadingSpinner label="Resizing image..." /> : null}
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
      </div>
      <div className="tool-sidebar">
        <ImagePreview title="Original image" src={previewUrl} details={fileInfo ? fileInfo.name : ''} />
        <ResultPreview src={result?.preview} details={result?.dimensions}>
          <DownloadButton onClick={() => saveBlobWithName(result.blob, file.name, 'resized', result.blob.type)} disabled={!result} />
        </ResultPreview>
      </div>
    </ToolPageShell>
  );
}

export default ResizePage;
