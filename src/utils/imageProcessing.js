import imageCompression from 'browser-image-compression';
import pica from 'pica';
import * as exifr from 'exifr';
import { saveAs } from 'file-saver';
import { extensionFromMimeType, fileNameWithoutExtension } from './fileHelpers';

const picaInstance = pica();

export function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load image.'));
    image.crossOrigin = 'anonymous';
    image.src = source;
  });
}

export function canvasToBlob(canvas, mimeType = 'image/png', quality = 0.92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Unable to export image.'));
        return;
      }
      resolve(blob);
    }, mimeType, quality);
  });
}

export async function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function compressImage(file, { quality = 0.8, maxSizeKB } = {}) {
  const options = {
    useWebWorker: true,
    initialQuality: quality,
    fileType: file.type || 'image/jpeg',
  };

  if (maxSizeKB) {
    options.maxSizeMB = maxSizeKB / 1024;
  }

  return imageCompression(file, options);
}

export async function resizeImage(file, { width, height, mimeType, quality = 0.92 }) {
  const sourceUrl = URL.createObjectURL(file);
  const image = await loadImage(sourceUrl);
  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = image.naturalWidth;
  sourceCanvas.height = image.naturalHeight;
  sourceCanvas.getContext('2d').drawImage(image, 0, 0);

  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = width;
  targetCanvas.height = height;
  await picaInstance.resize(sourceCanvas, targetCanvas, { alpha: true });

  const blob = await canvasToBlob(targetCanvas, mimeType || file.type || 'image/png', quality);
  URL.revokeObjectURL(sourceUrl);
  return blob;
}

export async function cropImage(source, cropPixels, mimeType = 'image/png', quality = 0.92) {
  const image = await loadImage(source);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;

  context.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
  );

  return canvasToBlob(canvas, mimeType, quality);
}

export async function transformImage(file, options = {}) {
  const {
    rotation = 0,
    flipHorizontal = false,
    flipVertical = false,
    mimeType = file.type || 'image/png',
    quality = 0.92,
  } = options;
  const sourceUrl = URL.createObjectURL(file);
  const image = await loadImage(sourceUrl);
  const radians = (rotation * Math.PI) / 180;
  const isQuarterTurn = Math.abs(rotation % 180) === 90;

  const canvas = document.createElement('canvas');
  canvas.width = isQuarterTurn ? image.naturalHeight : image.naturalWidth;
  canvas.height = isQuarterTurn ? image.naturalWidth : image.naturalHeight;

  const context = canvas.getContext('2d');
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(radians);
  context.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
  context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

  const blob = await canvasToBlob(canvas, mimeType, quality);
  URL.revokeObjectURL(sourceUrl);
  return blob;
}

export async function convertImage(file, mimeType, quality = 0.92) {
  const sourceUrl = URL.createObjectURL(file);
  const image = await loadImage(sourceUrl);
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  canvas.getContext('2d').drawImage(image, 0, 0);
  const blob = await canvasToBlob(canvas, mimeType, quality);
  URL.revokeObjectURL(sourceUrl);
  return blob;
}

export async function addTextWatermark(file, settings) {
  const sourceUrl = URL.createObjectURL(file);
  const image = await loadImage(sourceUrl);
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);

  const { text, position, fontSize, color, opacity } = settings;
  context.font = `${fontSize}px sans-serif`;
  context.fillStyle = color;
  context.globalAlpha = opacity;
  const metrics = context.measureText(text);
  const padding = 24;
  const positions = {
    'top-left': { x: padding, y: fontSize + padding },
    'top-right': { x: canvas.width - metrics.width - padding, y: fontSize + padding },
    center: { x: (canvas.width - metrics.width) / 2, y: canvas.height / 2 },
    'bottom-left': { x: padding, y: canvas.height - padding },
    'bottom-right': { x: canvas.width - metrics.width - padding, y: canvas.height - padding },
  };

  const point = positions[position] || positions['bottom-right'];
  context.fillText(text, point.x, point.y);
  context.globalAlpha = 1;
  const blob = await canvasToBlob(canvas, file.type || 'image/png');
  URL.revokeObjectURL(sourceUrl);
  return blob;
}

export async function applyAdjustments(file, settings) {
  const sourceUrl = URL.createObjectURL(file);
  const image = await loadImage(sourceUrl);
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext('2d');
  context.filter = [
    settings.grayscale ? 'grayscale(1)' : 'grayscale(0)',
    `brightness(${settings.brightness}%)`,
    `contrast(${settings.contrast}%)`,
    `blur(${settings.blur}px)`,
  ].join(' ');
  context.drawImage(image, 0, 0);
  context.filter = 'none';

  if (settings.pixelate > 1) {
    const pixelCanvas = document.createElement('canvas');
    const pixelContext = pixelCanvas.getContext('2d');
    pixelCanvas.width = Math.max(1, Math.floor(canvas.width / settings.pixelate));
    pixelCanvas.height = Math.max(1, Math.floor(canvas.height / settings.pixelate));
    pixelContext.drawImage(canvas, 0, 0, pixelCanvas.width, pixelCanvas.height);
    context.imageSmoothingEnabled = false;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(pixelCanvas, 0, 0, pixelCanvas.width, pixelCanvas.height, 0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;
  }

  if (settings.roundedCorners > 0) {
    const radius = settings.roundedCorners;
    const roundedCanvas = document.createElement('canvas');
    roundedCanvas.width = canvas.width;
    roundedCanvas.height = canvas.height;
    const roundedContext = roundedCanvas.getContext('2d');
    roundedContext.beginPath();
    roundedContext.moveTo(radius, 0);
    roundedContext.lineTo(canvas.width - radius, 0);
    roundedContext.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
    roundedContext.lineTo(canvas.width, canvas.height - radius);
    roundedContext.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
    roundedContext.lineTo(radius, canvas.height);
    roundedContext.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
    roundedContext.lineTo(0, radius);
    roundedContext.quadraticCurveTo(0, 0, radius, 0);
    roundedContext.closePath();
    roundedContext.clip();
    roundedContext.drawImage(canvas, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(roundedCanvas, 0, 0);
  }

  if (settings.borderWidth > 0) {
    context.lineWidth = settings.borderWidth;
    context.strokeStyle = settings.borderColor;
    context.strokeRect(0, 0, canvas.width, canvas.height);
  }

  const blob = await canvasToBlob(canvas, file.type || 'image/png');
  URL.revokeObjectURL(sourceUrl);
  return blob;
}

export async function readMetadata(file) {
  const parsed = await exifr.parse(file, true).catch(() => null);
  return parsed || null;
}

export async function stripMetadata(file) {
  return convertImage(file, file.type || 'image/png');
}

export function saveBlobWithName(blob, originalName, suffix = 'edited', mimeType = blob.type) {
  const baseName = fileNameWithoutExtension(originalName);
  const extension = extensionFromMimeType(mimeType);
  saveAs(blob, `${baseName}-${suffix}.${extension}`);
}
