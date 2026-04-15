import React, { useState } from 'react';
import useImageFile from '../hooks/useImageFile';
import ToolPageShell from '../components/ToolPageShell';
import FileUpload from '../components/FileUpload';
import ImagePreview from '../components/ImagePreview';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

function Base64EncodePage() {
  const { previewUrl, setFile, error, setError } = useImageFile();
  const [success, setSuccess] = useState('');

  async function copyBase64() {
    if (!previewUrl) {
      setError('Upload an image to generate a Base64 string.');
      return;
    }

    await navigator.clipboard.writeText(previewUrl);
    setSuccess('Base64 data URL copied to the clipboard.');
    setError('');
  }

  return (
    <ToolPageShell
      title="Image to Base64"
      description="Convert an image into a Base64 data URL directly in the browser."
      seoContent={{
        whatItDoes: 'This tool reads the uploaded image and outputs a Base64 data URL that can be copied or embedded elsewhere.',
        howToUse: 'Upload an image, then copy the generated Base64 string from the textarea or with the copy button.',
        whyUseful: 'Base64 strings are useful when embedding small images into HTML, CSS, JSON payloads, or quick prototyping workflows.',
      }}
      faqItems={[
        { question: 'Will Base64 make the image file smaller?', answer: 'No. Base64 usually increases the total size, so it is mainly for transport or embedding scenarios.' },
        { question: 'Does the conversion happen locally?', answer: 'Yes. The browser reads the image file and creates the Base64 string on-device.' },
      ]}
    >
      <div className="tool-main">
        <FileUpload onChange={(event) => { setFile(event.target.files?.[0] || null); setSuccess(''); }} />
        <div className="panel">
          <div className="action-row">
            <button className="button" type="button" onClick={copyBase64}>Copy Base64</button>
          </div>
          <label className="field">
            <span>Base64 output</span>
            <textarea rows="12" value={previewUrl} readOnly placeholder="Upload an image to generate a Base64 data URL." />
          </label>
        </div>
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
      </div>
      <div className="tool-sidebar">
        <ImagePreview title="Image preview" src={previewUrl} />
      </div>
    </ToolPageShell>
  );
}

export default Base64EncodePage;
