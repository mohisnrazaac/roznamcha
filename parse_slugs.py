import re
import html
import json

with open('/tmp/blog.html', 'r') as f:
    content = f.read()

match = re.search(r'data-page="([^"]*)"', content)
if match:
    encoded = match.group(1)
    decoded = html.unescape(encoded)
    data = json.loads(decoded)
    posts = data.get('props', {}).get('posts', {}).get('data', [])
    for p in posts:
        print(p.get('slug'))
