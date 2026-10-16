import ftplib
import os
import urllib.request

env = {}
with open('.env') as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            env[k] = v

ftp = ftplib.FTP(env['DEPLOY_FTP_HOST'])
ftp.login(env['DEPLOY_FTP_USER'], env['DEPLOY_FTP_PASS'])

print("Uploading create_post.php...")
with open('create_post.php', 'rb') as f:
    ftp.storbinary('STOR public_html/create_post_xyz123.php', f)

print("Triggering via web...")
response = urllib.request.urlopen('https://roznamcha.pk/create_post_xyz123.php')
print(response.read().decode('utf-8'))

print("Deleting script...")
ftp.delete('public_html/create_post_xyz123.php')
ftp.quit()
print("Done!")
