import React, { useState } from 'react';
import ToolPageShell from '../components/ToolPageShell';
import ResultPreview from '../components/ResultPreview';
import DownloadButton from '../components/DownloadButton';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import { downloadBlob } from '../utils/fileHelpers';

function Base64DecodePage() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState(null);

  function handleConvert() {
    try {
      const trimmed = input.trim();
      if (!trimmed.startsWith('data:image/')) throw new Error('Please paste a valid image Base64 data URL.');

      const [header, data] = trimmed.split(',');
      const mimeMatch = header.match(/data:(image\/[a-zA-Z0-9+.-]+);base64/);
      if (!mimeMatch) throw new Error('The Base64 string must include an image MIME type header.');

      const mimeType = mimeMatch[1];
      const binary = atob(data);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }

      const blob = new Blob([bytes], { type: mimeType });
      setResult({ blob, preview: trimmed, mimeType });
      setSuccess('Base64 decoded successfully.');
      setError('');
    } catch (decodeError) {
      setError(decodeError.message || 'Unable to decode this Base64 string.');
      setSuccess('');
      setResult(null);
    }
  }

  return (
    <ToolPageShell
      title="Base64 to Image"
      description="Convert a Base64 image string back into a downloadable browser preview."
      seoContent={{
        whatItDoes: 'This tool decodes a Base64 image data URL and renders it back into a downloadable image preview.',
        howToUse: 'Paste a valid image Base64 data URL, convert it, preview the result, and download the generated file.',
        whyUseful: 'It is handy for debugging encoded assets, recovering browser-friendly image data, or testing integrations that use Base64 image payloads.',
      }}
      faqItems={[
        { question: 'Does this require the full data URL header?', answer: 'Yes. This version expects a standard data:image/...;base64,... string so it can detect the output type.' },
        { question: 'Can I paste plain binary Base64 without a header?', answer: 'Not in this release. Supporting raw Base64 without metadata would need an extra MIME-type selector.' },
      ]}
    >
      <div className="tool-main">
        <div className="panel">
          <label className="field">
            <span>Base64 image string</span>
            <textarea rows="12" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste a data:image/...;base64,... string here" />
          </label>
          <div className="action-row">
            <button className="button" type="button" onClick={handleConvert}>Convert to Image</button>
          </div>
        </div>
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
      </div>
      <div className="tool-sidebar">
        <ResultPreview src={result?.preview} details={result?.mimeType}>
          <DownloadButton onClick={() => downloadBlob(result.blob, `decoded-image.${result.mimeType.includes('png') ? 'png' : result.mimeType.includes('webp') ? 'webp' : 'jpg'}`)} disabled={!result} />
        </ResultPreview>
      </div>
    </ToolPageShell>
  );
}

export default Base64DecodePage;
