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

def upload_dir(local_dir, remote_dir):
    try:
        ftp.mkd(remote_dir)
    except:
        pass
    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        remote_path = f"{remote_dir}/{item}"
        if os.path.isfile(local_path):
            upload_file(local_path, remote_path)
        elif os.path.isdir(local_path):
            upload_dir(local_path, remote_path)

upload_file('database/seeders/KametiBlogPostSeeder.php', 'rozapp/database/seeders/KametiBlogPostSeeder.php')
upload_dir('public', 'public_html')
upload_file('run_seeder.php', 'public_html/run_seeder.php')

ftp.quit()
print("Done!")
