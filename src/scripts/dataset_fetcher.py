from kaggle.api.kaggle_api_extended import KaggleApi
import os
import json
from bs4 import BeautifulSoup
import requests

def returnImage(url):
    response = requests.get(url)
    print(response.content)
    soup = BeautifulSoup(response.content, "html.parser")

    target_div = soup.find("div", class_="sc-fPyrPm bZnrci")

    if target_div:
        img_tag = target_div.find("img")
        img_src = img_tag['src'] if img_tag and 'src' in img_tag.attrs else None

        # print("Image:", img_src)
        
        return img_src
    else:
        return "Target div not found."

api = KaggleApi()
api.authenticate()

def fetch_datasets(query):
    api = KaggleApi()
    api.authenticate()
    datasets = api.dataset_list(search=query, max_size=100000000, sort_by='votes')
    # print(datasets[0])
    simplified = []
    for d in datasets:
        # img = returnImage(f"https://www.kaggle.com/datasets/{d.ref}")
        simplified.append({
            "id": d.id,
            "ref": d.ref,
            "title": d.title,
            # "img": img,
            "size_mb": round(d.total_bytes / (1024**2), 2),
            "url": f"https://www.kaggle.com/datasets/{d.ref}"
        })
    return simplified

def download_dataset(ref):
    # top_dataset = datasets[0].ref
    api.dataset_download_files(ref, path='downloads', unzip=True)
    print(f"Downloaded: {ref}")

