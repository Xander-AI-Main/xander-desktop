import os
import json

def fileExists(folderName):
    if(os.path.exists(os.path.join('downloads',  folderName))):
        return True

    return False

def return_all_models():
    if not os.path.exists('models'):
        return []
    else:
        dirs = os.listdir('models')
        data = []
        
        for dir in dirs:
            path = os.path.join('models', dir, 'logs.json')
            with open(path, 'r') as f:
                curr = json.load(f)
            data.append(curr)
            
        # print(data)
        return data       