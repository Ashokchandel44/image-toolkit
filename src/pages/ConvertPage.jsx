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
import { CONVERT_OPTIONS } from '../utils/constants';
import { blobToDataUrl, convertImage, saveBlobWithName } from '../utils/imageProcessing';

function ConvertPage() {
  const { file, previewUrl, setFile, error, setError } = useImageFile();
  const [targetType, setTargetType] = useState('image/png');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [success, setSuccess] = useState('');

  async function handleConvert() {
    if (!file) {
      setError('Please upload an image before converting.');
      return;
    }

    if (file.type === targetType) {
      setError('Choose a different target format to convert the image.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const blob = await convertImage(file, targetType);
      const preview = await blobToDataUrl(blob);
      setResult({ blob, preview });
      setSuccess('Conversion completed successfully.');
    } catch (processingError) {
      setError(processingError.message || 'This conversion is not available in your current browser. Please try another target format.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="Convert Image Format"
      description="Convert JPG, PNG, and WebP images directly in the browser using browser-supported export formats."
      seoContent={{
        whatItDoes: 'This tool re-exports uploaded images as another browser-supported image format such as JPG, PNG, or WebP.',
        howToUse: 'Upload an image, select the output format, convert it, and download the new file.',
        whyUseful: 'Format conversion helps balance compatibility, file size, and transparency support across different use cases.',
      }}
      faqItems={[
        { question: 'Why are only a few formats offered?', answer: 'The app only exposes formats that browsers can reliably export client-side without a backend.' },
        { question: 'Can I convert PNG to SVG?', answer: 'No. True raster-to-SVG conversion is not a safe or reliable browser-only conversion for this project.' },
      ]}
    >
      <div className="tool-main">
        <FileUpload onChange={(event) => { setFile(event.target.files?.[0] || null); setResult(null); }} />
        <ToolOptionsPanel title="Conversion settings" actions={<button className="button" type="button" onClick={handleConvert} disabled={loading}>Convert Image</button>}>
          <label className="field">
            <span>Target format</span>
            <select value={targetType} onChange={(event) => setTargetType(event.target.value)}>
              {CONVERT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <p className="helper-text">
            Browser export support varies slightly. If a conversion is unavailable, the app will show an error instead of failing silently.
          </p>
        </ToolOptionsPanel>
        {loading ? <LoadingSpinner label="Converting image..." /> : null}
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
      </div>
      <div className="tool-sidebar">
        <ImagePreview title="Original image" src={previewUrl} />
        <ResultPreview src={result?.preview}>
          <DownloadButton onClick={() => saveBlobWithName(result.blob, file.name, 'converted', result.blob.type)} disabled={!result} />
        </ResultPreview>
      </div>
    </ToolPageShell>
  );
}

export default ConvertPage;
