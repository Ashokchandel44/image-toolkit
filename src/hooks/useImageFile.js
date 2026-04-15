import { useEffect, useMemo, useState } from 'react';
import { formatBytes, readFileAsDataUrl } from '../utils/fileHelpers';

function useImageFile() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (!file) {
      setPreviewUrl('');
      return undefined;
    }

    setLoading(true);
    setError('');

    readFileAsDataUrl(file)
      .then((dataUrl) => {
        if (active) {
          setPreviewUrl(dataUrl);
        }
      })
      .catch(() => {
        if (active) {
          setError('We could not read this image file. Please try another file.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [file]);

  const fileInfo = useMemo(() => {
    if (!file) {
      return null;
    }

    return {
      name: file.name,
      type: file.type || 'Unknown',
      size: file.size,
      formattedSize: formatBytes(file.size),
    };
  }, [file]);

  return {
    file,
    fileInfo,
    previewUrl,
    error,
    loading,
    setError,
    setFile,
  };
}

export default useImageFile;
