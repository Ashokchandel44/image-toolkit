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
import { blobToDataUrl, saveBlobWithName, transformImage } from '../utils/imageProcessing';

function RotatePage() {
  const { file, previewUrl, setFile, error, setError } = useImageFile();
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [success, setSuccess] = useState('');

  async function applyTransform(nextRotation = rotation, nextFlipHorizontal = flipHorizontal, nextFlipVertical = flipVertical) {
    if (!file) {
      setError('Upload an image first.');
      return;
    }

    setRotation(nextRotation);
    setFlipHorizontal(nextFlipHorizontal);
    setFlipVertical(nextFlipVertical);
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const blob = await transformImage(file, {
        rotation: nextRotation,
        flipHorizontal: nextFlipHorizontal,
        flipVertical: nextFlipVertical,
      });
      const preview = await blobToDataUrl(blob);
      setResult({ blob, preview });
      setSuccess('Transformation applied successfully.');
    } catch (processingError) {
      setError(processingError.message || 'Unable to transform the image.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      title="Rotate and Flip Image"
      description="Rotate images left or right and flip them horizontally or vertically with instant browser-side processing."
      seoContent={{
        whatItDoes: 'This tool rotates an image in 90 degree steps and flips it horizontally or vertically using canvas transformations.',
        howToUse: 'Upload an image, use the rotate or flip controls, preview the result, and download the processed file.',
        whyUseful: 'It is helpful for correcting photo orientation, mirroring designs, or preparing graphics for different layouts.',
      }}
      faqItems={[
        { question: 'Can I rotate more than once?', answer: 'Yes. Every click updates the current rotation state in 90 degree increments.' },
        { question: 'Will the image be re-uploaded anywhere?', answer: 'No. Transformations happen locally inside the browser.' },
      ]}
    >
      <div className="tool-main">
        <FileUpload onChange={(event) => { setFile(event.target.files?.[0] || null); setResult(null); }} />
        <div className="panel button-panel">
          <button className="button" type="button" onClick={() => applyTransform((rotation - 90 + 360) % 360)}>Rotate Left</button>
          <button className="button" type="button" onClick={() => applyTransform((rotation + 90) % 360)}>Rotate Right</button>
          <button className="button secondary" type="button" onClick={() => applyTransform(rotation, !flipHorizontal, flipVertical)}>Flip Horizontal</button>
          <button className="button secondary" type="button" onClick={() => applyTransform(rotation, flipHorizontal, !flipVertical)}>Flip Vertical</button>
        </div>
        {loading ? <LoadingSpinner label="Applying transform..." /> : null}
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
      </div>
      <div className="tool-sidebar">
        <ImagePreview title="Original image" src={previewUrl} />
        <ResultPreview src={result?.preview}>
          <DownloadButton onClick={() => saveBlobWithName(result.blob, file.name, 'rotated', result.blob.type)} disabled={!result} />
        </ResultPreview>
      </div>
    </ToolPageShell>
  );
}

export default RotatePage;
