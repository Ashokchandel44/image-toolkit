export const ACCEPTED_IMAGE_TYPES = 'image/png,image/jpeg,image/jpg,image/webp,image/gif,image/bmp';

export const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/image-compressor/', label: 'Compress' },
  { path: '/image-resizer/', label: 'Resize' },
  { path: '/image-cropper/', label: 'Crop' },
  { path: '/rotate-image', label: 'Rotate' },
  { path: '/jpg-to-png/', label: 'JPG to PNG' },
  { path: '/webp-converter/', label: 'WebP' },
  { path: '/watermark-image/', label: 'Watermark' },
  { path: '/adjust-image', label: 'Adjust' },
  { href: 'https://travelwithanki.com/calculators/', label: 'Calculators', external: true },
];

export const TOOL_CARDS = [
  { title: 'JPG to PNG Converter', path: '/jpg-to-png/', description: 'Convert JPG images to PNG in your browser with a private, no-upload workflow.' },
  { title: 'PNG to JPG Converter', path: '/png-to-jpg/', description: 'Convert PNG images to JPG for smaller, widely compatible image files.' },
  { title: 'Image Compressor', path: '/image-compressor/', description: 'Reduce image file size in the browser with quality controls and download-ready output.' },
  { title: 'Image Resizer', path: '/image-resizer/', description: 'Resize by custom dimensions or handy presets while keeping aspect ratio when needed.' },
  { title: 'Image Cropper', path: '/image-cropper/', description: 'Select and export a precise crop using an interactive crop area selector.' },
  { title: 'WebP Converter', path: '/webp-converter/', description: 'Convert JPG or PNG images to WebP for lighter, website-friendly image files.' },
  { title: 'Rotate and Flip', path: '/rotate-image', description: 'Rotate left or right and flip images horizontally or vertically without leaving the browser.' },
  { title: 'Convert Image Format', path: '/convert-image', description: 'Convert common browser-supported formats such as JPG, PNG, and WebP.' },
  { title: 'Watermark Image', path: '/watermark-image/', description: 'Apply a configurable text watermark with position, color, opacity, and font size controls.' },
  { title: 'Basic Image Adjustments', path: '/adjust-image', description: 'Apply grayscale, brightness, contrast, blur, border, rounded corners, and pixelation effects.' },
  { title: 'Metadata Tools', path: '/remove-image-metadata', description: 'Inspect available browser-readable metadata and export a cleaned copy without metadata.' },
  { title: 'Image to Base64', path: '/image-to-base64', description: 'Convert an uploaded image into a Base64 data URL for embedding or transport.' },
  { title: 'Base64 to Image', path: '/base64-to-image', description: 'Paste a Base64 image string and turn it back into a downloadable image file.' },
  { title: 'Instagram Resize', path: '/resize-image-for-instagram', description: 'Quickly resize for the most common Instagram post format.' },
  { title: 'YouTube Thumbnail Resize', path: '/resize-image-for-youtube-thumbnail', description: 'Prepare YouTube thumbnail images at the recommended dimensions in one click.' },
];

export const RESIZE_PRESETS = [
  { label: 'Custom', width: 0, height: 0 },
  { label: 'Instagram Post', width: 1080, height: 1080 },
  { label: 'Instagram Story', width: 1080, height: 1920 },
  { label: 'Facebook Post', width: 1200, height: 630 },
  { label: 'YouTube Thumbnail', width: 1280, height: 720 },
  { label: 'WhatsApp', width: 800, height: 800 },
  { label: 'Twitter/X Post', width: 1600, height: 900 },
  { label: 'LinkedIn Post', width: 1200, height: 627 },
];

export const SOCIAL_PRESETS = {
  'instagram-post': {
    title: 'Resize Image for Instagram',
    description: 'Create a square 1080 x 1080 image ready for Instagram posts.',
    preset: { label: 'Instagram Post', width: 1080, height: 1080 },
  },
  'youtube-thumbnail': {
    title: 'Resize Image for YouTube Thumbnail',
    description: 'Export a 1280 x 720 thumbnail that fits YouTube thumbnail guidelines.',
    preset: { label: 'YouTube Thumbnail', width: 1280, height: 720 },
  },
};

export const CONVERT_OPTIONS = [
  { value: 'image/jpeg', label: 'JPG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/webp', label: 'WebP' },
];

export const WATERMARK_POSITIONS = ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'];
