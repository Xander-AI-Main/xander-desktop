import os

def fileExists(folderName):
    if(os.path.exists(os.path.join('downloads',  folderName))):
        return True

    return False