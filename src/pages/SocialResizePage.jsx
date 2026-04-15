import React, { useMemo, useState } from 'react';
import useImageFile from '../hooks/useImageFile';
import ToolPageShell from '../components/ToolPageShell';
import FileUpload from '../components/FileUpload';
import ImagePreview from '../components/ImagePreview';
import ResultPreview from '../components/ResultPreview';
import DownloadButton from '../components/DownloadButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import { SOCIAL_PRESETS } from '../utils/constants';
import { blobToDataUrl, resizeImage, saveBlobWithName } from '../utils/imageProcessing';

function SocialResizePage({ presetKey }) {
  const presetData = useMemo(() => SOCIAL_PRESETS[presetKey] || SOCIAL_PRESETS['instagram-post'], [presetKey]);
  const { file, previewUrl, setFile, error, setError } = useImageFile();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [success, setSuccess] = useState('');

  async function handleResize() {
    if (!file) {
      setError('Please upload an image first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const blob = await resizeImage(file, {
        width: presetData.preset.width,
        height: presetData.preset.height,
        mimeType: file.type || 'image/png',
      });
      const preview = await blobToDataUrl(blob);
      setResult({ blob, preview });
      setSuccess(`${presetData.preset.label} resize is ready to download.`);
    } catch (processingError) {
      setError(processingError.message || 'Unable to create the social media export.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title={presetData.title}
      description={presetData.description}
      seoContent={{
        whatItDoes: `This preset tool resizes your image to ${presetData.preset.width} x ${presetData.preset.height} for a common social media format.`,
        howToUse: 'Upload an image, run the preset resize, preview the result, and download the platform-ready image.',
        whyUseful: 'Preset dimensions save time and help avoid blurry uploads, awkward crops, or inconsistent social media graphics.',
      }}
      faqItems={[
        { question: 'Will this crop my image?', answer: 'No. This tool performs a resize to the target dimensions. If your source aspect ratio differs, proportions may stretch, so crop first when needed.' },
        { question: 'Are more social presets available?', answer: 'Yes. The main resize page includes Instagram, Facebook, YouTube, WhatsApp, X, and LinkedIn presets.' },
      ]}
    >
      <div className="tool-main">
        <FileUpload onChange={(event) => { setFile(event.target.files?.[0] || null); setResult(null); }} />
        <div className="panel">
          <h2>{presetData.preset.label}</h2>
          <p>{presetData.preset.width} x {presetData.preset.height} pixels</p>
          <div className="action-row">
            <button className="button" type="button" onClick={handleResize} disabled={loading}>Create Export</button>
          </div>
        </div>
        {loading ? <LoadingSpinner label="Creating social media image..." /> : null}
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
      </div>
      <div className="tool-sidebar">
        <ImagePreview title="Original image" src={previewUrl} />
        <ResultPreview src={result?.preview} details={`${presetData.preset.width} x ${presetData.preset.height}`}>
          <DownloadButton onClick={() => saveBlobWithName(result.blob, file.name, presetKey, result.blob.type)} disabled={!result} />
        </ResultPreview>
      </div>
    </ToolPageShell>
  );
}

export default SocialResizePage;
