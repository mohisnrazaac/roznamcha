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
with open('RewriteBatchSixSeeder.php', 'rb') as f:
    ftp.storbinary('STOR rozapp/database/seeders/RewriteBatchSixSeeder.php', f)
ftp.quit()
