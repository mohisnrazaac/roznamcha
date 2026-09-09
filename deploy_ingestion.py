import ftplib
import io
import os
import urllib.request
import json

env = {}
with open('.env') as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            env[k] = v

host = env['DEPLOY_FTP_HOST']
user = env['DEPLOY_FTP_USER']
password = env['DEPLOY_FTP_PASS']
secret_key = env['AGENT_INGESTION_SECRET']

print(f"Connecting to {host} as {user}...")
ftp = ftplib.FTP(host)
ftp.login(user, password)
print("FTP connection established.")

def upload_file(local_path, remote_path):
    print(f"Uploading {local_path} -> {remote_path}...")
    with open(local_path, 'rb') as f:
        ftp.storbinary(f"STOR {remote_path}", f)

def ensure_dir(remote_dir):
    parts = remote_dir.split('/')
    current = ""
    for part in parts:
        if not part: continue
        current = f"{current}/{part}" if current else part
        try:
            ftp.mkd(current)
        except Exception:
            pass

# 1. Update remote .env if AGENT_INGESTION_SECRET is missing
bio = io.BytesIO()
ftp.retrbinary('RETR rozapp/.env', bio.write)
remote_env = bio.getvalue().decode('utf-8')

if 'AGENT_INGESTION_SECRET' not in remote_env:
    print("Appending AGENT_INGESTION_SECRET to remote rozapp/.env...")
    if not remote_env.endswith('\n'):
        remote_env += '\n'
    remote_env += f"\nAGENT_INGESTION_SECRET={secret_key}\n"
    ftp.storbinary('STOR rozapp/.env', io.BytesIO(remote_env.encode('utf-8')))
    print("Remote rozapp/.env updated successfully.")
else:
    print("AGENT_INGESTION_SECRET already present in remote rozapp/.env.")

# 2. Ensure directories exist
ensure_dir('rozapp/app/Http/Controllers/Api')
ensure_dir('rozapp/app/Http/Middleware')
ensure_dir('rozapp/routes')
ensure_dir('rozapp/config')
ensure_dir('rozapp/bootstrap')

# 3. Upload code files
upload_file('app/Http/Controllers/Api/ContentIngestionController.php', 'rozapp/app/Http/Controllers/Api/ContentIngestionController.php')
upload_file('app/Http/Middleware/VerifyIngestionKey.php', 'rozapp/app/Http/Middleware/VerifyIngestionKey.php')
upload_file('bootstrap/app.php', 'rozapp/bootstrap/app.php')
upload_file('config/services.php', 'rozapp/config/services.php')
upload_file('routes/api.php', 'rozapp/routes/api.php')

# 4. Upload cache clearer to public_html
cache_clearer_code = """<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

\\Artisan::call('config:clear');
\\Artisan::call('route:clear');
\\Artisan::call('cache:clear');

if (function_exists('opcache_reset')) {
    @opcache_reset();
}

$hasSecret = !empty(config('services.agent.secret_key'));
$secretLen = strlen((string) config('services.agent.secret_key'));

header('Content-Type: application/json');
echo json_encode([
    'status' => 'cleared',
    'has_secret' => $hasSecret,
    'secret_length' => $secretLen,
]);

unlink(__FILE__);
"""

ftp.storbinary('STOR public_html/deploy_cache_clear.php', io.BytesIO(cache_clearer_code.encode('utf-8')))
print("Uploaded deploy_cache_clear.php to public_html.")

ftp.quit()
print("FTP deployment finished.")

# 5. Trigger remote cache clear
print("Triggering https://roznamcha.pk/deploy_cache_clear.php...")
req = urllib.request.Request('https://roznamcha.pk/deploy_cache_clear.php', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=20) as resp:
        body = resp.read().decode('utf-8')
        print("Cache clear response:", body)
except Exception as e:
    print("Cache clear error:", e)

print("Production deployment step complete.")
