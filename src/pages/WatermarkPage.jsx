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
import { WATERMARK_POSITIONS } from '../utils/constants';
import { addTextWatermark, blobToDataUrl, saveBlobWithName } from '../utils/imageProcessing';

function WatermarkPage() {
  const { file, previewUrl, setFile, error, setError } = useImageFile();
  const [text, setText] = useState('ImageToolkit');
  const [position, setPosition] = useState('bottom-right');
  const [fontSize, setFontSize] = useState(32);
  const [opacity, setOpacity] = useState(0.5);
  const [color, setColor] = useState('#ffffff');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [success, setSuccess] = useState('');

  async function handleWatermark() {
    if (!file || !text.trim()) {
      setError('Upload an image and enter watermark text first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const blob = await addTextWatermark(file, { text, position, fontSize, opacity, color });
      const preview = await blobToDataUrl(blob);
      setResult({ blob, preview });
      setSuccess('Watermark applied successfully.');
    } catch (processingError) {
      setError(processingError.message || 'Unable to apply the watermark.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="Watermark Image"
      description="Add a text watermark to images online with control over position, size, color, and opacity."
      seoContent={{
        whatItDoes: 'This tool overlays text on top of your uploaded image and exports a watermarked version.',
        howToUse: 'Upload an image, enter watermark text, adjust the style and position, then export the final image.',
        whyUseful: 'Watermarks can help with attribution, branding, copyright reminders, or creating drafts for review.',
      }}
      faqItems={[
        { question: 'Does this add text only or image logos too?', answer: 'This version focuses on reliable browser-side text watermarks. Image-logo watermark support can be added later.' },
        { question: 'Can I control watermark transparency?', answer: 'Yes. Use the opacity slider to make the watermark lighter or stronger.' },
      ]}
    >
      <div className="tool-main">
        <FileUpload onChange={(event) => { setFile(event.target.files?.[0] || null); setResult(null); }} />
        <ToolOptionsPanel title="Watermark settings" actions={<button className="button" type="button" onClick={handleWatermark} disabled={loading}>Apply Watermark</button>}>
          <label className="field">
            <span>Watermark text</span>
            <input type="text" value={text} onChange={(event) => setText(event.target.value)} />
          </label>
          <label className="field">
            <span>Position</span>
            <select value={position} onChange={(event) => setPosition(event.target.value)}>
              {WATERMARK_POSITIONS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Font size</span>
            <input type="number" min="12" max="200" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Opacity: {opacity.toFixed(2)}</span>
            <input type="range" min="0.1" max="1" step="0.05" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Color</span>
            <input type="color" value={color} onChange={(event) => setColor(event.target.value)} />
          </label>
        </ToolOptionsPanel>
        {loading ? <LoadingSpinner label="Applying watermark..." /> : null}
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
      </div>
      <div className="tool-sidebar">
        <ImagePreview title="Original image" src={previewUrl} />
        <ResultPreview src={result?.preview}>
          <DownloadButton onClick={() => saveBlobWithName(result.blob, file.name, 'watermarked', result.blob.type)} disabled={!result} />
        </ResultPreview>
      </div>
    </ToolPageShell>
  );
}

export default WatermarkPage;
