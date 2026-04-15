import React, { useState } from 'react';
import useImageFile from '../hooks/useImageFile';
import ToolPageShell from '../components/ToolPageShell';
import FileUpload from '../components/FileUpload';
import ImagePreview from '../components/ImagePreview';
import ResultPreview from '../components/ResultPreview';
import DownloadButton from '../components/DownloadButton';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import { blobToDataUrl, readMetadata, saveBlobWithName, stripMetadata } from '../utils/imageProcessing';

function MetadataPage() {
  const { file, previewUrl, setFile, error, setError } = useImageFile();
  const [metadata, setMetadata] = useState(null);
  const [cleanedResult, setCleanedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  async function handleInspect() {
    if (!file) {
      setError('Upload an image to inspect metadata.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const parsed = await readMetadata(file);
      setMetadata(parsed);
      setSuccess(parsed ? 'Metadata loaded where browser access allows.' : 'No readable metadata was found for this file.');
    } catch (processingError) {
      setError(processingError.message || 'Unable to read metadata from this file.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveMetadata() {
    if (!file) {
      setError('Upload an image first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const blob = await stripMetadata(file);
      const preview = await blobToDataUrl(blob);
      setCleanedResult({ blob, preview });
      setSuccess('A cleaned copy was exported by re-rendering the image in canvas.');
    } catch (processingError) {
      setError(processingError.message || 'Unable to export a cleaned image copy.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="Metadata Tools"
      description="Inspect available browser-readable image metadata and export a cleaned copy with metadata removed by re-rendering."
      seoContent={{
        whatItDoes: 'This tool reads metadata that the browser can access and removes most metadata by exporting a new canvas-rendered copy of the image.',
        howToUse: 'Upload an image, inspect the metadata details if available, and create a cleaned export when you want to remove metadata.',
        whyUseful: 'Metadata tools can help with privacy, cleaner file sharing, and understanding what extra information an image may contain.',
      }}
      faqItems={[
        { question: 'Will every EXIF field be available?', answer: 'Not always. Browser access and file differences can limit what metadata is readable.' },
        { question: 'How does metadata removal work?', answer: 'The image is re-exported through canvas, which removes most metadata in a browser-safe way.' },
      ]}
    >
      <div className="tool-main">
        <FileUpload onChange={(event) => { setFile(event.target.files?.[0] || null); setMetadata(null); setCleanedResult(null); }} />
        <div className="panel button-panel">
          <button className="button" type="button" onClick={handleInspect}>View Metadata</button>
          <button className="button secondary" type="button" onClick={handleRemoveMetadata}>Remove Metadata</button>
        </div>
        {loading ? <LoadingSpinner label="Reading metadata..." /> : null}
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
        <section className="panel">
          <h2>Metadata output</h2>
          {metadata ? (
            <pre className="metadata-output">{JSON.stringify(metadata, null, 2)}</pre>
          ) : (
            <p className="helper-text">Browser-side metadata access is limited. When available, readable fields will appear here.</p>
          )}
        </section>
      </div>
      <div className="tool-sidebar">
        <ImagePreview title="Original image" src={previewUrl} />
        <ResultPreview src={cleanedResult?.preview} details="Cleaned export with most metadata removed">
          <DownloadButton onClick={() => saveBlobWithName(cleanedResult.blob, file.name, 'no-metadata', cleanedResult.blob.type)} disabled={!cleanedResult} />
        </ResultPreview>
      </div>
    </ToolPageShell>
  );
}

export default MetadataPage;
