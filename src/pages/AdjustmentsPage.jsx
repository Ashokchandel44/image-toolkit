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
import { applyAdjustments, blobToDataUrl, saveBlobWithName } from '../utils/imageProcessing';

function AdjustmentsPage() {
  const { file, previewUrl, setFile, error, setError } = useImageFile();
  const [settings, setSettings] = useState({
    grayscale: false,
    brightness: 100,
    contrast: 100,
    blur: 0,
    borderWidth: 0,
    borderColor: '#111827',
    roundedCorners: 0,
    pixelate: 1,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [success, setSuccess] = useState('');

  function updateSetting(key, value) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  async function handleAdjust() {
    if (!file) {
      setError('Please upload an image first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const blob = await applyAdjustments(file, settings);
      const preview = await blobToDataUrl(blob);
      setResult({ blob, preview });
      setSuccess('Adjustments applied successfully.');
    } catch (processingError) {
      setError(processingError.message || 'Unable to apply the image adjustments.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="Basic Image Adjustments"
      description="Apply grayscale, brightness, contrast, blur, border, rounded corners, and pixelate effects in the browser."
      seoContent={{
        whatItDoes: 'This tool applies a practical set of browser-friendly image effects using the Canvas API and related browser rendering features.',
        howToUse: 'Upload an image, tune the sliders and toggles, apply the adjustments, and download the processed output.',
        whyUseful: 'These adjustments can quickly improve presentation for social media, content publishing, design drafts, and lightweight edits.',
      }}
      faqItems={[
        { question: 'Are these adjustments destructive?', answer: 'Only the exported copy is changed. Your original uploaded file remains untouched.' },
        { question: 'Is blur a preview trick or a real export?', answer: 'The blur is rendered into the exported result using canvas filters where supported by the browser.' },
      ]}
    >
      <div className="tool-main">
        <FileUpload onChange={(event) => { setFile(event.target.files?.[0] || null); setResult(null); }} />
        <ToolOptionsPanel title="Adjustment settings" actions={<button className="button" type="button" onClick={handleAdjust} disabled={loading}>Apply Adjustments</button>}>
          <label className="checkbox-field">
            <input type="checkbox" checked={settings.grayscale} onChange={(event) => updateSetting('grayscale', event.target.checked)} />
            <span>Grayscale</span>
          </label>
          <label className="field">
            <span>Brightness: {settings.brightness}%</span>
            <input type="range" min="50" max="200" value={settings.brightness} onChange={(event) => updateSetting('brightness', Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Contrast: {settings.contrast}%</span>
            <input type="range" min="50" max="200" value={settings.contrast} onChange={(event) => updateSetting('contrast', Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Blur: {settings.blur}px</span>
            <input type="range" min="0" max="10" step="1" value={settings.blur} onChange={(event) => updateSetting('blur', Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Border width</span>
            <input type="number" min="0" max="50" value={settings.borderWidth} onChange={(event) => updateSetting('borderWidth', Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Border color</span>
            <input type="color" value={settings.borderColor} onChange={(event) => updateSetting('borderColor', event.target.value)} />
          </label>
          <label className="field">
            <span>Rounded corners</span>
            <input type="number" min="0" max="200" value={settings.roundedCorners} onChange={(event) => updateSetting('roundedCorners', Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Pixelate strength</span>
            <input type="number" min="1" max="40" value={settings.pixelate} onChange={(event) => updateSetting('pixelate', Number(event.target.value))} />
          </label>
        </ToolOptionsPanel>
        {loading ? <LoadingSpinner label="Applying image adjustments..." /> : null}
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
      </div>
      <div className="tool-sidebar">
        <ImagePreview title="Original image" src={previewUrl} />
        <ResultPreview src={result?.preview}>
          <DownloadButton onClick={() => saveBlobWithName(result.blob, file.name, 'adjusted', result.blob.type)} disabled={!result} />
        </ResultPreview>
      </div>
    </ToolPageShell>
  );
}

export default AdjustmentsPage;
