# ImageToolkit

ImageToolkit is a production-ready React web app that runs entirely in the browser after build. It is designed for shared hosting deployment with no Node.js backend, no API routes, no database, and no runtime server logic required in production.

## Features

- Compress images with quality control and optional target size.
- Resize images with custom dimensions and social-media presets.
- Crop images with an interactive crop area selector.
- Rotate and flip images in the browser.
- Convert JPG, PNG, and WebP where browser export support exists.
- Add text watermarks with position, size, color, and opacity controls.
- Apply grayscale, brightness, contrast, blur, border, rounded-corner, and pixelate effects.
- View browser-readable metadata and export a cleaned copy with metadata removed.
- Convert image files to Base64 and decode Base64 image strings back into files.
- Includes dedicated routes for Instagram and YouTube thumbnail resizing.

## Tech Stack

- React with plain JavaScript
- React Router
- Vite
- react-helmet-async
- browser-image-compression
- pica
- react-easy-crop
- file-saver
- exifr
- Canvas API

## Project Structure

```text
image-toolkit/
  public/
    .htaccess
  src/
    components/
    hooks/
    pages/
    styles/
    utils/
    App.jsx
    main.jsx
  index.html
  package.json
  vite.config.js
  README.md
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the local development server:

```bash
npm start
```

3. Build for production:

```bash
npm run build
```

## Shared Hosting Deployment

1. Run `npm run build`.
2. Upload the contents of the generated `dist/` folder to:

```text
public_html/image-toolkit/
```

3. Make sure the uploaded folder includes the generated assets, `index.html`, and the copied `.htaccess` file from `public/.htaccess`.
4. Visit your deployed subfolder URL, for example:

```text
https://your-domain.com/image-toolkit/
```

## Routing For `public_html/image-toolkit/`

This project is already configured for subfolder deployment:

- `vite.config.js` uses `/image-toolkit/` as the production `base`.
- `BrowserRouter` uses `import.meta.env.BASE_URL` as its `basename`.
- `public/.htaccess` rewrites non-file requests to `/image-toolkit/index.html`.

If you deploy to a different subfolder later, update the path in all three places:

- `vite.config.js`
- `public/.htaccess`
- any deployment documentation that references `/image-toolkit/`

## Shared Hosting Rewrite Rules

The included `.htaccess` file is:

```apache
RewriteEngine On
RewriteBase /image-toolkit/
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /image-toolkit/index.html [L]
```

## Browser Limitations

- Format conversion is limited to what the browser can decode and export reliably.
- Metadata viewing depends on what EXIF data the browser and file allow client-side libraries to read.
- Metadata removal works by re-exporting through canvas, which removes most metadata but may also normalize color/profile details.
- Target file size for compression is best-effort and not guaranteed to match exactly.
- Animated image formats such as animated GIF or animated WebP are not preserved when re-rendered through canvas.

## Production Notes

- The final built app is static and frontend-only.
- Uploaded images are processed on the client side.
- No Express server, Node runtime, API routes, or backend services are needed after build.
- The project is suitable for Hostinger-style shared hosting as long as the built files are uploaded to the target folder.
