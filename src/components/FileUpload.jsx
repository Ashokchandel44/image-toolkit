import React from 'react';
import { ACCEPTED_IMAGE_TYPES } from '../utils/constants';

function FileUpload({ id = 'image-upload', label = 'Upload image', onChange, helperText }) {
  return (
    <div className="panel file-upload">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input id={id} type="file" accept={ACCEPTED_IMAGE_TYPES} onChange={onChange} />
      {helperText ? <p className="helper-text">{helperText}</p> : null}
    </div>
  );
}

export default FileUpload;
