import ftplib
import os
import sys
import time
import urllib.request
import json

print("=== STARTING PRODUCTION DEPLOYMENT ===")

env = {}
with open('.env') as f:
    for line in f:
        if '=' in line and not line.startswith('#'):
            k, v = line.strip().split('=', 1)
            env[k] = v

host = env.get('DEPLOY_FTP_HOST')
user = env.get('DEPLOY_FTP_USER')
password = env.get('DEPLOY_FTP_PASS')

if not host or not user or not password:
    print("Error: Missing FTP credentials in .env")
    sys.exit(1)

print(f"Connecting to FTP {host} as {user}...")
ftp = ftplib.FTP(host, timeout=30)
ftp.login(user, password)
print("FTP connection established.")

def ensure_dir(remote_dir):
    parts = remote_dir.split('/')
    current = ""
    for part in parts:
        if not part: continue
        current = f"{current}/{part}" if current else part
        try:
            ftp.mkd(current)
        except Exception:
            pass

def upload_file(local_path, remote_path):
    print(f"  Uploading {local_path} -> {remote_path}...")
    with open(local_path, 'rb') as f:
        ftp.storbinary(f"STOR {remote_path}", f)

def upload_dir(local_dir, remote_dir):
    ensure_dir(remote_dir)
    for root, dirs, files in os.walk(local_dir):
        rel_path = os.path.relpath(root, local_dir)
        if rel_path == ".":
            dest_dir = remote_dir
        else:
            dest_dir = f"{remote_dir}/{rel_path}".replace("\\", "/")
        ensure_dir(dest_dir)
        for f in files:
            if f == ".DS_Store" or f.endswith(".map"):
                continue
            src_file = os.path.join(root, f)
            dest_file = f"{dest_dir}/{f}".replace("\\", "/")
            upload_file(src_file, dest_file)

# 1. Upload new and modified component/page files
print("\n[1/4] Uploading React source files to rozapp...")
ensure_dir('rozapp/resources/js/Components')
ensure_dir('rozapp/resources/js/Components/SEO')
ensure_dir('rozapp/resources/js/Pages/Public/Tools')
ensure_dir('rozapp/database/seeders')

upload_file('resources/js/Components/SarkariTayariPromoCard.jsx', 'rozapp/resources/js/Components/SarkariTayariPromoCard.jsx')
upload_file('resources/js/Components/SEO/SeoLandingPage.jsx', 'rozapp/resources/js/Components/SEO/SeoLandingPage.jsx')
upload_file('resources/js/Pages/Public/Tools/RationCostEstimator.jsx', 'rozapp/resources/js/Pages/Public/Tools/RationCostEstimator.jsx')
upload_file('resources/js/Pages/Public/Tools/MonthlyHouseholdBudgetCalculator.jsx', 'rozapp/resources/js/Pages/Public/Tools/MonthlyHouseholdBudgetCalculator.jsx')
upload_file('resources/js/Pages/Public/Tools/ElectricityBillEstimator.jsx', 'rozapp/resources/js/Pages/Public/Tools/ElectricityBillEstimator.jsx')
upload_file('RewriteBatchOneSeeder.php', 'rozapp/RewriteBatchOneSeeder.php')
upload_file('RewriteBatchFourSeeder.php', 'rozapp/RewriteBatchFourSeeder.php')
upload_file('database/seeders/InjectSarkariTayariLinksSeeder.php', 'rozapp/database/seeders/InjectSarkariTayariLinksSeeder.php')

# 2. Upload compiled Vite build and SSR bundles
print("\n[2/4] Uploading compiled frontend assets...")
upload_dir('public/build', 'public_html/build')
upload_dir('bootstrap/ssr', 'rozapp/bootstrap/ssr')

# 3. Create remote database update runner script
print("\n[3/4] Preparing remote database update runner...")
runner_code = r'''<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Security check
if (!isset($_GET['token']) || $_GET['token'] !== 'deploy_secret_2026_sarkari') {
    http_response_code(403);
    die('Forbidden');
}

$appPath = __DIR__ . '/../rozapp';
if (!file_exists($appPath . '/vendor/autoload.php')) {
    $appPath = __DIR__;
}

require $appPath . '/vendor/autoload.php';
$app = require_once $appPath . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\BlogPost;
use App\Models\BlogCategory;

echo "<h3>Running SarkariTayari Link Seeder on Production...</h3>\n";

// A. Run Injections for existing posts
$paragraphA = '<p>While budgeting apps and ration calculators help plug leakages, the safest shield against volatile food inflation and DISCO electricity tariff spikes is a pension-backed government position. You can track verified department openings, test dates, and official syllabus breakdowns directly on <a href="https://sarkaritayari.pk" target="_blank" rel="noopener noreferrer">Sarkari Tayari</a>.</p>';

$paragraphB = '<p>When utility bills outpace routine increments, scaling household income through public sector recruitment or civil service exams becomes a top priority. Browse current federal and provincial openings, syllabus guides, and roll number slips on <a href="https://sarkaritayari.pk" target="_blank" rel="noopener noreferrer">sarkaritayari.pk</a>.</p>';

$targetSlugsA = [
    'cost-of-living-pakistan-2026-monthly-budget',
    'cost-of-living-pakistan-2026-monthly-budget-with-ai',
    'ghar-ka-monthly-budget',
    'pakistani-family-monthly-expense-control',
    'best-monthly-budget-50000-salary-pakistan-2026',
];

foreach ($targetSlugsA as $slug) {
    $post = BlogPost::where('slug', $slug)->first();
    if ($post && !str_contains($post->content, 'sarkaritayari.pk')) {
        if (str_contains($post->content, '</article>')) {
            $post->content = str_replace('</article>', "\n  " . $paragraphA . "\n</article>", $post->content);
        } else {
            $post->content = rtrim($post->content) . "\n" . $paragraphA;
        }
        $post->save();
        echo "Injected Paragraph A into: {$slug}<br>\n";
    } else {
        echo "Post {$slug}: already updated or missing.<br>\n";
    }
}

$targetSlugsB = [
    'pakistan-electricity-tariff-increases-and-household-budgeting-defense-2026',
    'electricity-bill-breakdown-pakistan-2026-unit-cost-fpa',
    'understanding-nepra-tariff-slabs-solar-net-metering-pakistan',
];

foreach ($targetSlugsB as $slug) {
    $post = BlogPost::where('slug', $slug)->first();
    if ($post && !str_contains($post->content, 'sarkaritayari.pk')) {
        if (str_contains($post->content, '</article>')) {
            $post->content = str_replace('</article>', "\n  " . $paragraphB . "\n</article>", $post->content);
        } else {
            $post->content = rtrim($post->content) . "\n" . $paragraphB;
        }
        $post->save();
        echo "Injected Paragraph B into: {$slug}<br>\n";
    } else {
        echo "Post {$slug}: already updated or missing.<br>\n";
    }
}

// B. Publish New Flagship Article
$title = "Beating Inflation in Pakistan: Why Household Budgeting Must Go Hand-in-Hand with Income Upgrades (And How Government Jobs Offer a Lifeline)";
$slug = "beating-inflation-in-pakistan-household-budgeting-income-upgrades";
$excerpt = "Managing household kharcha in Pakistan requires more than tight expense cutting. Explore realistic budget breakdowns across three income tiers, the biological limits of cost reduction, and why public sector careers provide an indispensable financial shield.";

// Read content from local publish script
$localFile = $appPath . '/publish_inflation_post.php';
$content = "";
if (file_exists($localFile)) {
    $fileCode = file_get_contents($localFile);
    if (preg_match('/\$content\s*=\s*<<<[\'"]?MARKDOWN[\'"]?\s*\n(.*?)\nMARKDOWN;/s', $fileCode, $m)) {
        $content = $m[1];
    }
}

if ($content) {
    $newPost = BlogPost::updateOrCreate(
        ['slug' => $slug],
        [
            'title' => $title,
            'excerpt' => $excerpt,
            'content' => $content,
            'content_format' => 'markdown',
            'status' => 'published',
            'published_at' => now(),
            'seo_title' => 'Beating Inflation in Pakistan: Budgeting vs Income Upgrades | Roznamcha',
            'seo_description' => 'Why Pakistani households must pair kharcha tracking with income upgrades, and how BPS government positions offer long-term financial security against inflation.',
            'seo_keywords' => 'Pakistan inflation, household budget Pakistan, BPS government jobs, kharcha tracking, electricity bill slabs, Sarkari Tayari, SarkariTayari.pk',
            'language' => 'en',
            'created_by' => 1,
            'updated_by' => 1,
        ]
    );

    if (method_exists($newPost, 'categories')) {
        $newPost->categories()->syncWithoutDetaching([1, 3]);
    }
    echo "<b>New Post Created/Updated ID: {$newPost->id} - {$newPost->slug}</b><br>\n";
} else {
    echo "Warning: Could not extract content for new post.<br>\n";
}

if (method_exists(BlogPost::class, 'forgetPublicSitemapCache')) {
    BlogPost::forgetPublicSitemapCache();
}

// Clear Laravel caches
Illuminate\Support\Facades\Artisan::call('cache:clear');
Illuminate\Support\Facades\Artisan::call('view:clear');
echo "Laravel cache and view cache cleared successfully!<br>\n";
'''

runner_path = 'public_html/remote_update_sarkari_temp.php'
upload_file('publish_inflation_post.php', 'rozapp/publish_inflation_post.php')

import io
ftp.storbinary(f'STOR {runner_path}', io.BytesIO(runner_code.encode('utf-8')))
print(f"Runner script uploaded to {runner_path}")

print("\nTriggering remote runner via HTTPS...")
try:
    url = "https://roznamcha.pk/remote_update_sarkari_temp.php?token=deploy_secret_2026_sarkari"
    req = urllib.request.Request(url, headers={'User-Agent': 'DeployBot/1.0'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        print("Remote Execution Output:")
        print(resp.read().decode('utf-8'))
except Exception as e:
    print(f"Execution notice: {e}")

# Clean up remote runner
print("\nRemoving temporary runner script from production...")
try:
    ftp.delete(runner_path)
    print("Temporary runner script removed.")
except Exception as e:
    print(f"Could not remove runner: {e}")

ftp.quit()
print("FTP session closed.")

# 4. Verify Production URLs
print("\n[4/4] Verifying production endpoints...")
time.sleep(2)
prod_urls = [
    "https://roznamcha.pk/blog/beating-inflation-in-pakistan-household-budgeting-income-upgrades",
    "https://roznamcha.pk/tools/ration-cost-estimator",
    "https://roznamcha.pk/electricity-bill-calculator-lesco",
    "https://roznamcha.pk/tools/electricity-bill-estimator",
    "https://roznamcha.pk/tools/monthly-household-budget-calculator",
]

for p_url in prod_urls:
    try:
        req = urllib.request.Request(p_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=15) as r:
            code = r.status
            html = r.read().decode('utf-8')
            has_sarkari = 'sarkaritayari.pk' in html
            print(f"  {p_url} -> Status: {code} | Contains target link: {has_sarkari}")
    except Exception as e:
        print(f"  {p_url} -> Error: {e}")

print("\n=== PRODUCTION DEPLOYMENT COMPLETE ===")
