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
import { blobToDataUrl, compressImage, saveBlobWithName } from '../utils/imageProcessing';
import { formatBytes } from '../utils/fileHelpers';

function CompressPage() {
  const { file, fileInfo, previewUrl, setFile, error, setError } = useImageFile();
  const [quality, setQuality] = useState(0.8);
  const [targetSizeKB, setTargetSizeKB] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [success, setSuccess] = useState('');

  async function handleCompress() {
    if (!file) {
      setError('Please upload an image before compressing.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const compressed = await compressImage(file, {
        quality,
        maxSizeKB: targetSizeKB ? Number(targetSizeKB) : undefined,
      });
      const preview = await blobToDataUrl(compressed);
      setResult({ blob: compressed, preview, size: compressed.size });
      setSuccess('Compression finished. Your smaller image is ready to download.');
    } catch (processingError) {
      setError(processingError.message || 'Compression failed. Please try a different file.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="Free Image Compressor Online"
      seoTitle="Free Image Compressor Online | Compress Images in Browser"
      description="Compress images online for free directly in your browser. Reduce image size while keeping good quality. No upload required."
      canonical="https://travelwithanki.com/image-toolkit/image-compressor/"
      intro="Compress JPG, PNG, and WebP images locally in your browser to create smaller files for websites, email, and sharing."
      seoContent={{
        whatItDoes: 'This free image compressor reduces file size using browser-based compression so you can create lighter images without uploading them.',
        howToUse: 'Upload an image, adjust the quality slider or enter a target size in KB, then compress and download the processed image.',
        whyUseful: 'Smaller image files load faster, use less storage, and are easier to share while keeping acceptable visual quality.',
      }}
      faqItems={[
        { question: 'Will image compression reduce quality?', answer: 'Usually a little, depending on the quality setting. The preview helps you decide whether the smaller file still looks good.' },
        { question: 'Are compressed images uploaded?', answer: 'No. Compression happens directly in your browser, so no upload is required.' },
      ]}
    >
      <div className="tool-main">
        <FileUpload onChange={(event) => { setFile(event.target.files?.[0] || null); setResult(null); }} helperText="Supported formats include JPG, PNG, WebP, GIF, and BMP where the browser can decode them." />
        <ToolOptionsPanel
          title="Compression settings"
          actions={<button className="button" type="button" onClick={handleCompress} disabled={loading}>Compress Image</button>}
        >
          <label className="field">
            <span>Quality: {Math.round(quality * 100)}%</span>
            <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
          </label>
          <label className="field">
            <span>Target size in KB (optional)</span>
            <input type="number" min="1" value={targetSizeKB} onChange={(event) => setTargetSizeKB(event.target.value)} placeholder="Example: 300" />
          </label>
          {fileInfo ? <div className="stat-card"><strong>Original size</strong><span>{fileInfo.formattedSize}</span></div> : null}
          {result ? <div className="stat-card"><strong>Compressed size</strong><span>{formatBytes(result.size)}</span></div> : null}
        </ToolOptionsPanel>
        {loading ? <LoadingSpinner label="Compressing your image..." /> : null}
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
      </div>
      <div className="tool-sidebar">
        <ImagePreview title="Original image" src={previewUrl} details={fileInfo ? `${fileInfo.name} • ${fileInfo.formattedSize}` : ''} />
        <ResultPreview src={result?.preview} details={result ? formatBytes(result.size) : ''}>
          <DownloadButton onClick={() => saveBlobWithName(result.blob, file.name, 'compressed', result.blob.type)} disabled={!result} />
        </ResultPreview>
      </div>
    </ToolPageShell>
  );
}

export default CompressPage;
