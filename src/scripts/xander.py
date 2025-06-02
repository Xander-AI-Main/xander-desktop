# from AIUnified.RegressionDL import RegressionDL
# from AIUnified.ClassificationDL import ClassificationDL
# from AIUnified.ClassificationDL import ClassificationDL
# from AIUnified.ImageModelTrainer import ImageModelTrainer
# from AIUnified.TextModel import TextModel
import numpy as np
import os
import pandas as pd
import zipfile
import json
import mimetypes
from sklearn.utils.multiclass import type_of_target

def returnArch(data, task, mainType, archType):
    current_task = data[task]

    for i in current_task:
        if i["type"] == mainType and i["archType"] == archType:
            return i["architecture"], i["hyperparameters"]
        
def isText(df, columns):
    text = []
    for column in columns:
        if df[column].dtype == object:
            text.append(True)
        else:
            text.append(False)

    if all(text):
        return True
    else:
        return False

def textToNum(finalColumn, x):
    arr = finalColumn.unique()
    indices = np.where(arr == x)[0]
    if indices.size > 0:
        index = indices[0]
        return index
    else:
        return -1

def determine_task(self, file_path):
        file_type = mimetypes.guess_type(file_path)[0]
        task_type = ''
        architecture_details = ''
        architecture = []
        hyperparameters = {}
        
        arch_data = {}
        with open ('arch.json') as f:
            arch_data = json.load(f)

        print(arch_data)

        if file_type == 'application/zip' or file_type == "application/x-zip-compressed":
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                file_list = zip_ref.namelist()
                if any(file.endswith(('.jpg', '.jpeg', '.png')) for file in file_list):
                    task_type = 'image'
                    architecture_details = 'Image processing architecture'
                    architecture, hyperparameters = returnArch(
                        arch_data, task_type, "DL", "default")
                else:
                    raise ValueError("No supported file types found in ZIP")

        elif file_type == 'application/json' or file_type == 'application/pdf':
            task_type = 'chatbot'
            architecture_details = 'Chatbot architecture'
            architecture, hyperparameters = returnArch(
                arch_data, task_type, "DL", "default")

        else:
            df = pd.read_csv(file_path)
            num_columns = df.select_dtypes(include=[np.number]).shape[1]
            all_columns = list(df.columns)
            final_column = df.iloc[:, -1]

            if isText(df, all_columns) == True and df.apply(lambda col: col.str.len().mean() > 10).any():
                print("Going in")
                task_type = 'text'
                architecture_details = 'NLP architecture'
                architecture, hyperparameters = returnArch(
                    arch_data, task_type, "DL", "default")
            else:
                df[all_columns[-1]] = df[all_columns[-1]
                                         ].apply(lambda x: textToNum(final_column, x))
                final_column = df.iloc[:, -1]
                unique_values = final_column.unique()
                if len(unique_values) / len(final_column) > 0.1:
                    task_type = 'regression'
                    architecture_details = 'Regression model architecture'
                    architecture, hyperparameters = returnArch(
                        arch_data, task_type, "DL", "default")
                else:
                    task_type = 'classification'
                    architecture_details = 'Classification model architecture'
                    architecture, hyperparameters = returnArch(
                        arch_data, task_type, "DL", "default")

        return task_type, hyperparameters, architecture

def get_info(task_type: str) -> dict:
    arch_data = {}
    with open ('src/scripts/arch.json') as f:
        arch_data = json.load(f)
    if task_type.lower() == 'anomaly':
        task_type = 'classification'
    architecture, hyperparameters = returnArch(arch_data, task_type.lower(), "DL", "default")
    
    return {"architecture": architecture, "hyperparameters": hyperparameters}

# def train(task_type, dataset_path):
#     arch_data = {}
#     arch_type = 'default'
#     with open ('arch.json') as f:
#         arch_data = json.load(f)

#     print(arch_data)
    
#     architecture, hyperparameters = returnArch(arch_data, task_type, "DL", "default")
#     pass

# def return_task_info(dataset, file):
#     file_path = os.path.join('downloads', dataset, file)
#     task = ''
    
#     if(file_path.endswith('.csv')):
#         df = pd.read_csv(file_path)
#         all_columns = list(df.columns)
#         final_column = df.iloc[:, -1]

#         if isText(df, all_columns) == True and df.apply(lambda col: col.str.len().mean() > 10).any():
#             task = 'Text'
#         else:
#             df[all_columns[-1]] = df[all_columns[-1]
#                                          ].apply(lambda x: textToNum(final_column, x))
#             final_column = df.iloc[:, -1]
#             unique_values = final_column.unique()
#             if len(unique_values) / len(final_column) > 0.25:
#                 task = 'Regression'
#             else:
#                 task = 'Classification'

#         return task, file_path


import pandas as pd
import os
from sklearn.utils.multiclass import type_of_target

def return_task_info(dataset, file):
    file_path = os.path.join('downloads', dataset, file)
    task = 'Unknown'

    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
        target = df.iloc[:, -1]  

        target = target.dropna()

        target_type = type_of_target(target)

        if target_type in ['binary', 'multiclass']:
            task = 'Classification'
        elif target_type in ['continuous', 'continuous-multioutput']:
            task = 'Regression'
        elif target_type in ['multilabel-indicator', 'multiclass-multioutput']:
            task = 'Classification'
        elif target_type == 'unknown':
            avg_len = target.astype(str).apply(len).mean()
            if avg_len > 20:
                task = 'Text'
        else:
            task = 'Unknown'

    return task, file_path
