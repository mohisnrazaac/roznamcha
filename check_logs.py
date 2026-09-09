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
try:
    ftp.retrbinary('RETR rozapp/storage/logs/laravel.log', r.write)
    lines = r.getvalue().decode('utf-8').split('\n')
    print('\n'.join(lines[-30:]))
except Exception as e:
    print("Could not read laravel.log:", e)

try:
    r2 = io.BytesIO()
    ftp.retrbinary('RETR public_html/error_log', r2.write)
    lines2 = r2.getvalue().decode('utf-8').split('\n')
    print('\n'.join(lines2[-30:]))
except Exception as e:
    print("Could not read error_log:", e)

ftp.quit()
