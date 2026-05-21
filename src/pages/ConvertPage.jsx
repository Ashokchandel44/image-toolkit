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

const CONVERT_PAGE_DATA = {
  generic: {
    title: 'Convert Image Format',
    seoTitle: 'Free Image Converter Online | Convert JPG, PNG & WebP',
    description: 'Convert JPG, PNG, and WebP images directly in the browser using browser-supported export formats.',
    canonical: 'https://travelwithanki.com/image-toolkit/convert-image/',
    targetType: 'image/png',
    intro: 'Convert common image formats online without uploading your files to a server.',
    whatItDoes: 'This tool re-exports uploaded images as another browser-supported image format such as JPG, PNG, or WebP.',
    howToUse: 'Upload an image, select the output format, convert it, and download the new file.',
    whyUseful: 'Format conversion helps balance compatibility, file size, and transparency support across different use cases.',
    faqs: [
      { question: 'Why are only a few formats offered?', answer: 'The app only exposes formats that browsers can reliably export client-side without a backend.' },
      { question: 'Can I convert PNG to SVG?', answer: 'No. True raster-to-SVG conversion is not a safe or reliable browser-only conversion for this project.' },
    ],
  },
  'jpg-to-png': {
    title: 'JPG to PNG Converter Online Free',
    seoTitle: 'JPG to PNG Converter Online Free | Convert Images in Browser',
    description: 'Convert JPG images to PNG online for free directly in your browser. Fast, private, and no upload required.',
    canonical: 'https://travelwithanki.com/image-toolkit/jpg-to-png/',
    targetType: 'image/png',
    intro: 'Turn JPG photos into PNG files in your browser when you need a PNG download for editing, sharing, or web use.',
    whatItDoes: 'This JPG to PNG converter reads your image locally and exports a PNG copy using browser canvas tools.',
    howToUse: 'Upload a JPG image, keep PNG selected as the target format, click convert, then download the PNG result.',
    whyUseful: 'PNG is useful when you need lossless-looking output, cleaner edges, or an image format accepted by design tools.',
    faqs: [
      { question: 'Are my JPG files uploaded?', answer: 'No. The conversion runs directly in your browser and does not require uploading your image.' },
      { question: 'Will the PNG file be larger than the JPG?', answer: 'Often yes. PNG can create larger files, but it is useful when quality and compatibility matter.' },
    ],
  },
  'png-to-jpg': {
    title: 'PNG to JPG Converter Online Free',
    seoTitle: 'PNG to JPG Converter Online Free | Convert Images in Browser',
    description: 'Convert PNG images to JPG online for free directly in your browser. Fast, simple, and no upload required.',
    canonical: 'https://travelwithanki.com/image-toolkit/png-to-jpg/',
    targetType: 'image/jpeg',
    intro: 'Convert PNG images into JPG files locally in your browser for easier sharing and smaller downloads.',
    whatItDoes: 'This PNG to JPG converter exports your uploaded PNG as a browser-generated JPG file.',
    howToUse: 'Upload a PNG image, keep JPG selected as the target format, click convert, and download the converted image.',
    whyUseful: 'JPG files are widely supported and often smaller than PNG files, especially for photos and blog images.',
    faqs: [
      { question: 'Does JPG support transparency?', answer: 'No. Transparent PNG areas are flattened when exported as JPG.' },
      { question: 'Is this PNG to JPG converter free?', answer: 'Yes. It is free to use and runs in your browser without an upload step.' },
    ],
  },
  'webp-converter': {
    title: 'Free WebP Converter Online',
    seoTitle: 'Free WebP Converter Online | Convert Images to WebP',
    description: 'Convert JPG or PNG images to WebP online for free directly in your browser. Make images lighter and faster for websites.',
    canonical: 'https://travelwithanki.com/image-toolkit/webp-converter/',
    targetType: 'image/webp',
    intro: 'Create WebP images from JPG or PNG files in your browser for faster website loading.',
    whatItDoes: 'This WebP converter exports uploaded images as WebP files using the browser’s built-in image export support.',
    howToUse: 'Upload a JPG or PNG image, choose WebP as the target format, convert the image, and download the WebP file.',
    whyUseful: 'WebP can reduce file size while keeping good visual quality, which helps pages load faster.',
    faqs: [
      { question: 'Can I convert JPG and PNG to WebP?', answer: 'Yes. Upload a browser-supported image such as JPG or PNG and export it as WebP.' },
      { question: 'Will WebP work everywhere?', answer: 'Most modern browsers support WebP, but older software may still need JPG or PNG.' },
    ],
  },
};

function ConvertPage({ variant = 'generic' }) {
  const pageData = CONVERT_PAGE_DATA[variant] || CONVERT_PAGE_DATA.generic;
  const { file, previewUrl, setFile, error, setError } = useImageFile();
  const [targetType, setTargetType] = useState(pageData.targetType);
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
      title={pageData.title}
      seoTitle={pageData.seoTitle}
      description={pageData.description}
      canonical={pageData.canonical}
      intro={pageData.intro}
      seoContent={{
        whatItDoes: pageData.whatItDoes,
        howToUse: pageData.howToUse,
        whyUseful: pageData.whyUseful,
      }}
      faqItems={pageData.faqs}
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
