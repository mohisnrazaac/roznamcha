import ftplib
import os

env = {}
with open('.env') as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            env[k] = v

host = env.get('DEPLOY_FTP_HOST')
user = env.get('DEPLOY_FTP_USER')
password = env.get('DEPLOY_FTP_PASS')

print(f"Connecting to {host}...")
ftp = ftplib.FTP(host)
ftp.login(user, password)

def upload_file(local_path, remote_path):
    print(f"Uploading {local_path} to {remote_path}...")
    try:
        with open(local_path, 'rb') as f:
            ftp.storbinary(f'STOR {remote_path}', f)
    except Exception as e:
        print(f"Failed to upload {local_path}: {e}")

def ensure_dir(remote_dir):
    parts = remote_dir.split('/')
    current = ""
    for part in parts:
        if not part: continue
        current = f"{current}/{part}" if current else part
        try:
            ftp.mkd(current)
        except:
            pass

def upload_dir(local_dir, remote_dir):
    ensure_dir(remote_dir)
    for item in os.listdir(local_dir):
        if item == '.DS_Store':
            continue
        local_path = os.path.join(local_dir, item)
        remote_path = f"{remote_dir}/{item}"
        if os.path.isfile(local_path):
            upload_file(local_path, remote_path)
        elif os.path.isdir(local_path):
            upload_dir(local_path, remote_path)

# Upload the changed PHP & view files
upload_file('resources/views/app.blade.php', 'rozapp/resources/views/app.blade.php')
upload_file('app/Http/Controllers/Concerns/BuildsPublicSeo.php', 'rozapp/app/Http/Controllers/Concerns/BuildsPublicSeo.php')
upload_file('app/Http/Controllers/PublicPageController.php', 'rozapp/app/Http/Controllers/PublicPageController.php')
upload_file('app/Http/Controllers/BlogPublicController.php', 'rozapp/app/Http/Controllers/BlogPublicController.php')
upload_file('app/Http/Controllers/TemplateController.php', 'rozapp/app/Http/Controllers/TemplateController.php')
upload_file('public/robots.txt', 'public_html/robots.txt')
upload_file('public/.htaccess', 'public_html/.htaccess')

# Upload the frontend builds
print("Uploading public/build...")
upload_dir('public/build', 'public_html/build')

print("Uploading bootstrap/ssr...")
upload_dir('bootstrap/ssr', 'rozapp/bootstrap/ssr')

# Upload cache clearer helpers
print("Uploading cache clearers...")
upload_file('clear_cache.php', 'public_html/clear_cache.php')
upload_file('clear_lscache.php', 'public_html/clear_lscache.php')

ftp.quit()
print("FTP upload finished. Triggering remote cache clear...")

import urllib.request
try:
    with urllib.request.urlopen('https://roznamcha.pk/clear_cache.php', timeout=15) as r:
        print("clear_cache.php:", r.read().decode('utf-8'))
except Exception as e:
    print("clear_cache.php notice:", e)

try:
    with urllib.request.urlopen('https://roznamcha.pk/clear_lscache.php', timeout=15) as r:
        print("clear_lscache.php:", r.read().decode('utf-8'))
except Exception as e:
    print("clear_lscache.php notice:", e)

print("Deployment complete!")
