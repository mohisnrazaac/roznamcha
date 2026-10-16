import re
import html
import json

with open('/tmp/blog.html', 'r') as f:
    content = f.read()

match = re.search(r'data-page="([^"]*)"', content)
if match:
    encoded_json = match.group(1)
    decoded_json = html.unescape(encoded_json)
    data = json.loads(decoded_json)
    
    posts = data.get('props', {}).get('posts', {}).get('data', [])
    print(f"Number of posts: {len(posts)}")
    for p in posts:
        print(f"- {p.get('title')} ({p.get('slug')})")
