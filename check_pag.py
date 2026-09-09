import re
import html
import json

with open('/tmp/blog2.html', 'r') as f:
    content = f.read()

match = re.search(r'data-page="([^"]*)"', content)
if match:
    encoded = match.group(1)
    decoded = html.unescape(encoded)
    data = json.loads(decoded)
    links = data.get('props', {}).get('posts', {}).get('links', [])
    print(f"Links count: {len(links)}")
    for link in links:
        print(f"- {link.get('label')}")
