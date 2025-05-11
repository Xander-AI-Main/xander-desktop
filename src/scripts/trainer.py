from AIUnified.RegressionDL import RegressionDL
from AIUnified.ClassificationDL import ClassificationDL
from AIUnified.ClassificationDL import ClassificationDL
from AIUnified.ImageModelTrainer import ImageModelTrainer
from AIUnified.TextModel import TextModel
import json
import pandas as pd
import chardet
import os

def train(task_type, dataset_path, architecture, hyperparamters):
    if(task_type.lower() == 'regression'):
        df = None
        encoding = None
        if(dataset_path.endswith('.csv')):
            df = pd.read_csv(dataset_path)
        elif (dataset_path.endswith('.xlsx')):
            df = pd.read_excel(dataset_path)
        
        target_col = list(df.columns[-1])

        with open(dataset_path, 'rb') as file:
            result = chardet.detect(file.read())
            encoding = result['encoding']
            
        model_trainer = RegressionDL(dataset_url=dataset_path, architecture=architecture, hyperparameters=hyperparamters, model_name=dataset_path.split('.')[0], target_col=target_col, encoding=encoding)
        
        executor = model_trainer.execute()

        for epoch_info in executor:
            if isinstance(epoch_info, dict) and 'epoch' in epoch_info:
                print(epoch_info)
            else:
                print(epoch_info)
                break