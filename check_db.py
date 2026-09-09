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

# Let's write a small php script to count active blog posts
script = """<?php
require __DIR__.'/../rozapp/vendor/autoload.php';
$app = require_once __DIR__.'/../rozapp/bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Http\\Kernel::class);
$response = $kernel->handle(Illuminate\\Http\\Request::capture());
echo "Published Posts: " . \\App\\Models\\BlogPost::where('status', 'published')->count();
"""
w = io.BytesIO(script.encode('utf-8'))
ftp.storbinary('STOR public_html/count_posts.php', w)
ftp.quit()
