from kaggle.api.kaggle_api_extended import KaggleApi
import os
import json
from bs4 import BeautifulSoup
import requests
import pandas as pd
import json

def returnImage(url):
    response = requests.get(url)
    print(response.content)
    soup = BeautifulSoup(response.content, "html.parser")

    target_div = soup.find("div", class_="sc-fPyrPm bZnrci")

    if target_div:
        img_tag = target_div.find("img")
        img_src = img_tag['src'] if img_tag and 'src' in img_tag.attrs else None

        return img_src
    else:
        return "Target div not found."

api = KaggleApi()
api.authenticate()

def fetch_datasets(query):
    api = KaggleApi()
    api.authenticate()
    datasets = api.dataset_list(search=query, max_size=100000000, sort_by='votes', page=1)
    datasets1 = api.dataset_list(search=query, max_size=100000000, sort_by='votes', page=2)
    simplified = []
    datasets += datasets1
    for d in datasets:
        simplified.append({
            "id": d.id,
            "ref": d.ref,
            "title": d.title,
            "subtitle": d.subtitle,
            "size_mb": round(d.total_bytes / (1024**2), 2),
            "url": f"https://www.kaggle.com/datasets/{d.ref}"
        })
    return simplified

def download_dataset(item, ref):
    safe_folder_name = ref.replace("/", "_")
    download_path = os.path.join("downloads", safe_folder_name)

    os.makedirs(download_path, exist_ok=True)

    api.dataset_download_files(ref, path=download_path, unzip=True)
    
    with open(os.path.join(download_path, "info.json"), "w") as json_file:
        json.dump(item, json_file, indent=4, ensure_ascii=False)

    
    return [{"status": "200", "message": f"Dataset downloaded to {download_path}"}]

def returnSavedDatasets():
    base_path = os.path.join('downloads')
    dirs = os.listdir(base_path)
    
    data = []
    for dir in dirs:
        path = os.path.join(base_path, dir, 'info.json')
        curr = {}
        with open(path, 'r') as f:
            curr = json.load(f)
        data.append(curr)
        
    return data

def return_all_datasets(folderName):
    base_path = os.path.join('downloads', folderName)
    dirs = os.listdir(base_path)
    # there could be files in the depth, there could be folders, there could be both folders & files
    # file types for now would be .csv, .jpg, .img
    
    # for .csv files in the first layer
    data = {}
    columns = []
    for file in dirs:
        if file.endswith('.csv'):
            try:
                df = pd.read_csv(os.path.join(base_path, file))
                df = df.dropna()
                columns = list(df.columns)
                data[file] = df.to_dict(orient='records')
            except Exception as e:
                data[file] = {'error': str(e)}  

    return {"data": data, "columns": columns}  