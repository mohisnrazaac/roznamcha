import urllib.request
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse
import re
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

base_url = "https://roznamcha.pk"
visited = set()
to_visit = [base_url]
results = []

print("Starting spider...")

while to_visit and len(visited) < 100: # Limit to 100 pages to avoid infinite loops
    url = to_visit.pop(0)
    if url in visited:
        continue
    visited.add(url)
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        response = urllib.request.urlopen(req, timeout=10, context=ctx)
        html = response.read().decode('utf-8', errors='ignore')
        
        results.append(f"[200 OK] {url}")
        
        # Find all href links
        links = re.findall(r'href="([^"]+)"', html)
        for link in links:
            if link.startswith('mailto:') or link.startswith('tel:') or link.startswith('#'):
                continue
            
            full_url = urljoin(url, link)
            parsed = urlparse(full_url)
            
            # Only crawl internal links
            if parsed.netloc == "roznamcha.pk" or parsed.netloc == "www.roznamcha.pk":
                # Remove fragments
                full_url = full_url.split('#')[0]
                if full_url not in visited and full_url not in to_visit:
                    to_visit.append(full_url)
                    
    except HTTPError as e:
        results.append(f"[{e.code} ERROR] {url}")
    except URLError as e:
        results.append(f"[CONNECTION ERROR] {url} - {e.reason}")
    except Exception as e:
        results.append(f"[UNKNOWN ERROR] {url} - {str(e)}")

with open('spider_report.txt', 'w') as f:
    for res in results:
        f.write(res + "\n")
print("Spider finished. Report saved to spider_report.txt")
