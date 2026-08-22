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

print("Uploading InflationBlogPostSeeder.php...")
with open('database/seeders/InflationBlogPostSeeder.php', 'rb') as f:
    ftp.storbinary('STOR rozapp/database/seeders/InflationBlogPostSeeder.php', f)

print("Uploading run_seeder.php...")
with open('run_seeder.php', 'rb') as f:
    ftp.storbinary('STOR public_html/run_seeder.php', f)

ftp.quit()
print("Upload complete!")
