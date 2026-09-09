import ftplib
import os
import io

env = {}
with open('.env') as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            env[k] = v

ftp = ftplib.FTP(env['DEPLOY_FTP_HOST'])
ftp.login(env['DEPLOY_FTP_USER'], env['DEPLOY_FTP_PASS'])

r = io.BytesIO()
ftp.retrbinary('RETR public_html/index.php', r.write)
print(r.getvalue().decode('utf-8'))

ftp.quit()
