#!/usr/bin/env python3
"""
AdSense Preflight Verification Suite for Roznamcha.pk
Performs exhaustive verification of all 29 sitemap URLs and infrastructure security boundaries.
"""

import sys
import urllib.request
import ssl
import re
import json
from html.parser import HTMLParser

ROOT_URL = "https://roznamcha.pk"
SITEMAP_URL = f"{ROOT_URL}/sitemap.xml"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; AdSensePreflight/2.0)"}

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_parts = []
        self.in_script = False
        self.in_style = False

    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'):
            self.in_script = True

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.in_script = False

    def handle_data(self, data):
        if not self.in_script:
            self.text_parts.append(data)

    def get_text(self):
        return ' '.join(self.text_parts)

def fetch_url(url, follow_redirects=True):
    class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
        def http_error_302(self, req, fp, code, msg, headers):
            return fp
        http_error_301 = http_error_302

    opener = urllib.request.build_opener() if follow_redirects else urllib.request.build_opener(NoRedirectHandler)
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with opener.open(req, timeout=30) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            return resp.status, content, resp.headers
    except urllib.error.HTTPError as e:
        content = e.read().decode('utf-8', errors='ignore')
        return e.code, content, e.headers
    except Exception as e:
        return 0, str(e), {}

def main():
    print(f"=== Starting AdSense Preflight against {ROOT_URL} ===")
    failures = []

    def fail(msg):
        print(f"  [FAIL] {msg}")
        failures.append(msg)

    def ok(msg):
        print(f"  [PASS] {msg}")

    # 1. Fetch sitemap
    print("\n1. Fetching Sitemap...")
    code, sitemap_xml, _ = fetch_url(SITEMAP_URL)
    if code != 200:
        fail(f"Sitemap HTTP code: {code}")
        return 1

    urls = re.findall(r'<loc>([^<]+)</loc>', sitemap_xml)
    print(f"Found {len(urls)} URLs in sitemap.")
    if len(urls) != 29:
        fail(f"Expected exactly 29 URLs in sitemap, found {len(urls)}")
    else:
        ok("Sitemap URL count is exactly 29")

    # 2. Sequential crawl of all sitemap URLs
    print("\n2. Sequential Crawl of all 29 URLs...")
    titles = {}
    descriptions = {}
    article_bodies = {}

    tools_routes = [
        "/tools/ration-cost-estimator",
        "/tools/monthly-household-budget-calculator",
        "/tools/school-fees-planner",
        "/tools/electricity-bill-estimator",
        "/tools/solar-net-metering-roi-calculator"
    ]
    legal_routes = ["/privacy-policy", "/terms", "/disclaimer", "/cookie-policy", "/editorial-policy"]
    ads_allowed_paths = [
        "/",
        "/features/monthly-expense-tracker-pakistan",
        *tools_routes,
    ]

    banned_strings = [
        "certified financial",
        "Financial & Tariff Experts",
        "hands-on testing",
        "S.R.O. 279(I)/2026",
        "S.R.O. 279(I)"
    ]

    for idx, url in enumerate(urls, start=1):
        path = url.replace(ROOT_URL, "")
        if path == "":
            path = "/"
        print(f"\n[{idx}/29] Checking {path}...")

        code, html, headers = fetch_url(url)
        if code != 200:
            fail(f"{path}: Expected HTTP 200, got {code}")
            continue
        ok(f"{path}: HTTP 200")

        # Canonical
        m_can = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', html, re.I)
        if not m_can:
            m_can = re.search(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']canonical["\']', html, re.I)
        if m_can:
            canonical = m_can.group(1).rstrip('/')
            expected_can = url.rstrip('/')
            if canonical == expected_can:
                ok(f"{path}: Canonical matches URL ({canonical})")
            else:
                fail(f"{path}: Canonical mismatch: expected {expected_can}, got {canonical}")
        else:
            fail(f"{path}: Missing canonical link")

        # Title
        m_title = re.search(r'<title[^>]*>([^<]+)</title>', html, re.I)
        if m_title:
            title = m_title.group(1).strip()
            if title in titles:
                fail(f"{path}: Duplicate title with {titles[title]}: '{title}'")
            else:
                titles[title] = path
                ok(f"{path}: Unique Title ('{title[:40]}...')")
        else:
            fail(f"{path}: Missing <title>")

        # Meta description
        m_desc = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)["\']', html, re.I)
        if not m_desc:
            m_desc = re.search(r'<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']description["\']', html, re.I)
        if m_desc:
            desc = m_desc.group(1).strip()
            if desc in descriptions:
                fail(f"{path}: Duplicate meta description with {descriptions[desc]}")
            else:
                descriptions[desc] = path
                ok(f"{path}: Unique Meta Description")
        else:
            fail(f"{path}: Missing meta description")

        # Exactly one H1
        h1_count = len(re.findall(r'<h1[ >]', html, re.I))
        if h1_count == 1:
            ok(f"{path}: Exactly one H1")
        else:
            fail(f"{path}: Expected 1 H1, found {h1_count}")

        # No localhost or 127.0.0.1
        if "127.0.0.1" in html or "localhost" in html:
            fail(f"{path}: Contains localhost or 127.0.0.1")
        else:
            ok(f"{path}: Clean of localhost/127.0.0.1")

        # No Ziggy route dump
        if "Ziggy=" in html or '"routes":{' in html:
            fail(f"{path}: Contains Ziggy route table dump")
        else:
            ok(f"{path}: Clean of Ziggy route dump")

        # None of the banned claim strings
        has_banned = False
        for bs in banned_strings:
            if bs.lower() in html.lower():
                fail(f"{path}: Contains banned claim string: '{bs}'")
                has_banned = True
        if not has_banned:
            ok(f"{path}: Clean of unverified claim strings")

        # Word count check
        parser = TextExtractor()
        parser.feed(html)
        text = parser.get_text()
        words = len(text.split())

        is_article = "/blog/" in path and "/category/" not in path
        is_tool = any(path.startswith(tr) for tr in tools_routes)
        is_legal = any(path.startswith(lr) for lr in legal_routes)

        if is_article:
            if words >= 1200:
                ok(f"{path}: Article word count {words} >= 1,200")
            else:
                fail(f"{path}: Article word count {words} < 1,200")

            # Exactly one Article JSON-LD
            article_schema_count = len(re.findall(r'"@type"\s*:\s*"Article"', html))
            if article_schema_count == 1:
                ok(f"{path}: Exactly 1 Article JSON-LD schema")
            else:
                fail(f"{path}: Expected 1 Article JSON-LD, found {article_schema_count}")

            # Store article body text for overlap analysis
            # Extract content from data-page if present, or general text
            m_dp = re.search(r'data-page="([^"]+)"', html)
            if m_dp:
                import html as html_lib
                try:
                    pdata = json.loads(html_lib.unescape(m_dp.group(1)))
                    body_content = pdata.get('props', {}).get('post', {}).get('content', '')
                    article_bodies[path] = body_content
                except Exception:
                    article_bodies[path] = text
            else:
                article_bodies[path] = text

        elif is_tool:
            if words >= 700:
                ok(f"{path}: Tool word count {words} >= 700")
            else:
                fail(f"{path}: Tool word count {words} < 700")
        elif is_legal:
            if words >= 250:
                ok(f"{path}: Legal word count {words} >= 250")
            else:
                fail(f"{path}: Legal word count {words} < 250")

        # AdSense script tag checks (verifying the actual external script tag in head)
        has_adsense_tag = bool(re.search(r'<script[^>]+src=[\"\']https://pagead2\.googlesyndication\.com', html))
        is_ad_allowed = (path in ads_allowed_paths) or is_article

        if is_ad_allowed:
            if has_adsense_tag:
                ok(f"{path}: AdSense tag present on allowed surface")
            else:
                fail(f"{path}: Expected AdSense tag on allowed surface, but missing")
        else:
            if not has_adsense_tag:
                ok(f"{path}: AdSense tag properly omitted from non-ad surface")
            else:
                fail(f"{path}: Prohibited AdSense tag found on non-ad surface")

    # 3. Pairwise article paragraph overlap check
    print("\n3. Pairwise Article Paragraph Overlap Analysis...")
    slugs = list(article_bodies.keys())
    print(f"Analyzing {len(slugs)} articles for content overlap...")

    def extract_paragraphs(html_text):
        paras = re.findall(r'<p[^>]*>(.*?)</p>', html_text, re.DOTALL)
        clean_paras = []
        for p in paras:
            cp = re.sub(r'<[^>]+>', ' ', p).strip()
            # Exclude author block or short navigation text
            if len(cp.split()) > 10 and "Mohsin Raza" not in cp and "Founder & Software Architect" not in cp:
                clean_paras.append(cp.lower())
        return set(clean_paras)

    article_paras = {s: extract_paragraphs(article_bodies[s]) for s in slugs}
    max_overlap = 0.0
    highest_pair = ("", "")

    for i in range(len(slugs)):
        for j in range(i + 1, len(slugs)):
            s1, s2 = slugs[i], slugs[j]
            p1, p2 = article_paras[s1], article_paras[s2]
            if not p1 or not p2:
                continue
            shared = len(p1.intersection(p2))
            smaller = min(len(p1), len(p2))
            overlap = (shared / smaller) * 100 if smaller > 0 else 0
            if overlap > max_overlap:
                max_overlap = overlap
                highest_pair = (s1, s2)
            if overlap >= 40:
                fail(f"Overlap between {s1} and {s2} is {overlap:.1f}% (>= 40%)")

    if max_overlap < 40:
        ok(f"All pairwise paragraph overlaps below 40% (highest: {max_overlap:.1f}% between {highest_pair[0]} and {highest_pair[1]})")

    # 4. Infrastructure & Boundary Checks
    print("\n4. Infrastructure, Redirect, and Security Boundary Checks...")
    
    # http -> https redirect
    code_http, _, hdrs_http = fetch_url("http://roznamcha.pk/", follow_redirects=False)
    if code_http in (301, 302, 308):
        ok(f"http -> https redirects with HTTP {code_http}")
    else:
        fail(f"http -> https expected redirect (301/302), got {code_http}")

    # www -> apex redirect
    code_www, _, hdrs_www = fetch_url("https://www.roznamcha.pk/", follow_redirects=False)
    if code_www in (301, 302, 308):
        ok(f"www -> apex redirects with HTTP {code_www}")
    else:
        fail(f"www -> apex expected redirect (301/302), got {code_www}")

    # ads.txt
    code_ads, ads_txt, _ = fetch_url(f"{ROOT_URL}/ads.txt")
    if code_ads == 200 and "pub-8709269992599634" in ads_txt and "google.com" in ads_txt:
        ok("ads.txt returns HTTP 200 with valid Google AdSense publisher ID")
    else:
        fail(f"ads.txt failed check (HTTP {code_ads})")

    # robots.txt
    code_rob, rob_txt, _ = fetch_url(f"{ROOT_URL}/robots.txt")
    if code_rob == 200 and "User-agent:" in rob_txt and "Sitemap:" in rob_txt:
        ok("robots.txt returns HTTP 200 with valid directives and sitemap")
    else:
        fail(f"robots.txt failed check (HTTP {code_rob})")

    # Security boundaries: /.env and /.git/config
    code_env, _, _ = fetch_url(f"{ROOT_URL}/.env")
    if code_env in (403, 404):
        ok(f"/.env is blocked (HTTP {code_env})")
    else:
        fail(f"/.env exposed! Got HTTP {code_env}")

    code_git, _, _ = fetch_url(f"{ROOT_URL}/.git/config")
    if code_git in (403, 404):
        ok(f"/.git/config is blocked (HTTP {code_git})")
    else:
        fail(f"/.git/config exposed! Got HTTP {code_git}")

    # Final tally
    print("\n" + "=" * 50)
    if failures:
        print(f"PREFLIGHT FAILED: {len(failures)} check(s) failed:")
        for f in failures:
            print(f"  - {f}")
        return 1
    else:
        print("PREFLIGHT PASSED: ALL AUDIT CHECKS MET PERFECTLY.")
        return 0

if __name__ == '__main__':
    sys.exit(main())
