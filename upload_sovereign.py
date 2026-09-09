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
with open('InsertSovereignCloudSeeder.php', 'rb') as f:
    ftp.storbinary('STOR rozapp/database/seeders/InsertSovereignCloudSeeder.php', f)

# I also need to upload the script to execute it. But wait, I deleted all scripts from public_html!
# So I must recreate a temporary script to execute it, and then I will delete it afterwards!
