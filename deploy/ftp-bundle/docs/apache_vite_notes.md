# Apache + Vite Notes

## public/.htaccess
Latest template (see `public/.htaccess`) handles RewriteBase, hashed Vite assets, and gzip:

```apacheconf
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Handle X-XSRF-Token Header
    RewriteCond %{HTTP:x-xsrf-token} .
    RewriteRule .* - [E=HTTP_X_XSRF_TOKEN:%{HTTP:X-XSRF-Token}]

    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Allow direct serving of built Vite assets
    RewriteCond %{REQUEST_URI} ^build/
    RewriteRule ^ - [L]

    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>

<IfModule mod_headers.c>
    <FilesMatch "\.(?:css|js|mjs|json|woff2?)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    <FilesMatch "\.(?:png|jpe?g|gif|svg|webp|ico)$">
        Header set Cache-Control "public, max-age=604800"
    </FilesMatch>
</IfModule>

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/css application/javascript application/json text/javascript
</IfModule>

<IfModule mod_mime.c>
    AddType application/javascript .mjs
</IfModule>
```

### Hosting in a subfolder
- Update `RewriteBase /subfolder/` and ensure cPanel’s DocumentRoot points to `…/public`.
- If Laravel runs under `/something/public`, expose assets via `https://domain.com/something/build/*`; see Vite notes below.

## Vite Base Path & Manifest
- `vite.config.js` now reads `process.env.VITE_BASE_PATH` and defaults to `/build/`. Set `VITE_BASE_PATH="/apps/roznamcha/public/build"` (or similar) in `.env` when Apache serves the app from a subdirectory; end the path with `/`.
- Vite writes hashed assets + `manifest.json` into `public/build`. Ensure FTP deployments upload the entire `public/build` folder together with backend code. Delete `public/hot` on production so Laravel uses the manifest.
- When `ASSET_URL` is set (e.g., CDN), keep it aligned with `VITE_BASE_PATH` so `@vite()` resolves the same origin. For cPanel + CDN, set `ASSET_URL=https://cdn.example.com/roznamcha` and `VITE_BASE_PATH=https://cdn.example.com/roznamcha/build/`.

## Ziggy & Absolute URLs
- Regenerate `resources/js/ziggy.js` after every route change; otherwise Ziggy will keep pointing to `http://127.0.0.1:8002`.
- When deploying under a subfolder, pass `ZIGGY_BASE_URL` via the Ziggy config (or override `url`/`port` when generating) so `route()` helpers produce the same URLs Apache expects.

## Storage & Symlinks
- Run `php artisan storage:link` on the server (Track 2 handles this) so `/storage/*` files resolve inside Apache after FTP uploads.
- For shared hosting where symlinks are restricted, create a real directory inside `public/storage` and copy assets during deploy (adjust `.deployignore` accordingly).
