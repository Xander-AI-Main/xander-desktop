import requests
import string
import statistics

chars = list(string.ascii_lowercase)
urls = [f'https://{c}.com' for c in chars]

print(urls)

for url in urls:
    if url == 'https://z.com':
        print(f"{url} is an active domain")
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            print(f"{url} is an active domain")
        else:
            print(f"{url} returned status code {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"{url} is not an active domain ({e.__class__.__name__})")
