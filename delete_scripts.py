import ftplib
import os

env = {}
with open('.env') as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            env[k] = v

ftp = ftplib.FTP(env['DEPLOY_FTP_HOST'])
ftp.login(env['DEPLOY_FTP_USER'], env['DEPLOY_FTP_PASS'])

ftp.cwd('public_html')
files = ftp.nlst()
deleted_count = 0

for file in files:
    if file.endswith('.php') and file != 'index.php':
        ftp.delete(file)
        print(f"Deleted: {file}")
        deleted_count += 1

print(f"Total deleted: {deleted_count}")
ftp.quit()
