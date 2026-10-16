import requests
import json
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

urls = [
    'https://roznamcha.pk/',
    'https://roznamcha.pk/about',
    'https://roznamcha.pk/contact',
    'https://roznamcha.pk/privacy',
    'https://roznamcha.pk/terms',
    'https://roznamcha.pk/cookie-policy',
    'https://roznamcha.pk/features',
    'https://roznamcha.pk/features/expense-tracker-pakistan',
    'https://roznamcha.pk/blog',
    'https://roznamcha.pk/tools/monthly-household-budget-calculator',
    'https://roznamcha.pk/tools/school-fees-planner',
    'https://roznamcha.pk/tools/electricity-bill-estimator',
    'https://roznamcha.pk/tools/ration-cost-estimator',
    'https://roznamcha.pk/sitemap.xml',
    'https://roznamcha.pk/ads.txt'
]

# I need to get the slugs dynamically from the live site's /blog page JSON, or just use the local DB since they are synced.
import sqlite3
import MySQLdb # actually it's mysql, let's fetch from the local DB

try:
    with open('.env', 'r') as f:
        env_vars = dict(line.strip().split('=', 1) for line in f if '=' in line and not line.startswith('#'))
    
    conn = MySQLdb.connect(
        host=env_vars.get('DB_HOST', '127.0.0.1'),
        user=env_vars.get('DB_USERNAME', 'root'),
        passwd=env_vars.get('DB_PASSWORD', ''),
        db=env_vars.get('DB_DATABASE', 'roznamcha')
    )
    cursor = conn.cursor()
    cursor.execute("SELECT slug FROM blog_posts WHERE status='published'")
    for (slug,) in cursor.fetchall():
        urls.append(f"https://roznamcha.pk/blog/{slug}")
        
    cursor.execute("SELECT slug FROM blog_categories")
    for (slug,) in cursor.fetchall():
        urls.append(f"https://roznamcha.pk/blog/category/{slug}")
        
except Exception as e:
    print(f"Error fetching DB: {e}")

issues = []
for url in urls:
    try:
        r = requests.get(url, verify=False, timeout=5)
        if r.status_code != 200:
            issues.append(f"[{r.status_code}] {url}")
    except Exception as e:
        issues.append(f"[ERROR] {url} - {str(e)}")

if not issues:
    print(f"SUCCESS: All {len(urls)} URLs returned 200 OK.")
else:
    print("FOUND ISSUES:")
    for issue in issues:
        print(issue)
