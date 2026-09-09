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

ftp = ftplib.FTP(host)
ftp.login(user, password)

print("Uploading hotfix.zip to root...")
with open('hotfix.zip', 'rb') as f:
    ftp.storbinary('STOR hotfix.zip', f)

print("Uploading unzip.php to public_html/...")
with open('unzip.php', 'rb') as f:
    ftp.storbinary('STOR public_html/unzip.php', f)

ftp.quit()
