import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import tensorflow as tf
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization, Add, Activation, Input
from tensorflow.keras.callbacks import Callback
import joblib
import os
import queue
import threading
import numpy as np
from tensorflow.keras.regularizers import l2
import random
from itertools import product
import chardet
import functools
import codename
import json
import absl.logging
absl.logging.set_verbosity(absl.logging.ERROR)

print = functools.partial(print, flush=True)

class ClassificationDL:
    def __init__(self, dataset_url, architecture, hyperparameters, model_name, target_col, encoding):
        physical_devices = tf.config.list_physical_devices('GPU')
        if physical_devices:
            print("GPU(s) detected:", len(physical_devices))
            for device in physical_devices:
                try:
                    tf.config.experimental.set_memory_growth(device, True)
                    tf.config.set_logical_device_configuration(
                        device,
                        [tf.config.LogicalDeviceConfiguration(memory_limit=1024 * 9)]
                    )
                    print(f"Memory configuration set for GPU device: {device}")
                except RuntimeError as e:
                    print(f"Error configuring GPU device {device}: {e}")
        else:
            print("No GPU devices detected. Running on CPU.")
            
        self.dataset_url = dataset_url
        self.architecture = architecture
        self.hyperparameters = hyperparameters
        self.model_name = model_name
        self.model_path = f'{model_name}.h5'
        self.scaler_path = f'scaler_{model_name}.pkl'
        self.label_encoder_path = f'label_encoder_{model_name}.pkl'
        self.directory_path = "models"
        
        if(not os.path.exists(self.directory_path)):
            os.makedirs(self.directory_path)
            
        self.complete_path = os.path.join(self.directory_path, model_name)
        self.complete_model_path = os.path.join(self.complete_path, self.model_path)
        self.complete_scaler_path = os.path.join(self.complete_path, self.scaler_path)
        self.complete_label_encoder_path = os.path.join(self.complete_path, self.label_encoder_path)
        self.target_col = target_col
        self.encoding = encoding
        # Initialize these variables
        self.current_epoch_info = None
        self.epoch_info_queue = None
        
        self.load_data()
        self.preprocess_data()
        
    def drop_id_like_columns(self, df, threshold=0.95):
        id_like_columns = []

        for col in df.columns:
            if df[col].dtype in ['object', 'int64', 'float64']:
                unique_ratio = df[col].nunique() / len(df)
                col_lower = col.lower()

                if unique_ratio > threshold and any(keyword in col_lower for keyword in ['id', 'record', 'index', 'uuid', 'code']):
                    id_like_columns.append(col)

        print(f"Dropping ID-like columns: {id_like_columns}")
        df = df.drop(columns=id_like_columns)
        return df
    
    def load_data(self):
        with open(self.dataset_url, 'rb') as file:
            result = chardet.detect(file.read())
            self.encoding = result['encoding']
        self.df = pd.read_csv(self.dataset_url, encoding=self.encoding)        
        self.df = self.df.dropna()
        
        def contains_url(column):
            if column.dtype == 'object':
                return column.str.contains(r'http[s]?://', na=False).any()
            return False

        url_columns = [col for col in self.df.columns if contains_url(self.df[col])]
        self.df = self.df.drop(columns=url_columns)
        
        self.df = self.drop_id_like_columns(self.df)
        
        target_idx = self.df.columns.get_loc(self.target_col)
        self.X = self.df.drop(columns=[self.target_col]) 
        self.y = self.df.iloc[:, target_idx]

        self.label_encoders = {}
        for column in self.X.select_dtypes(include=['object']).columns:
            le = LabelEncoder()
            self.X[column] = le.fit_transform(self.X[column])
            self.label_encoders[column] = le

        if self.y.dtype == object:
            le = LabelEncoder()
            self.y = le.fit_transform(self.y)
            self.label_encoders['target'] = le

        # Store column names for inference
        self.feature_columns = self.X.columns.tolist()
        
        self.unique_labels = np.unique(self.y)
        self.label_map = {label: i for i, label in enumerate(self.unique_labels)}
        self.y = np.array([self.label_map[label] for label in self.y])
        for column, le in self.label_encoders.items():
            print(f"Column: {column}, Classes: {list(le.classes_)}")

    def preprocess_data(self):
        self.scaler = StandardScaler()
        self.X_standardized = self.scaler.fit_transform(self.X)
        self.X = self.X_standardized
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            self.X, self.y, test_size=0.2, random_state=42)

    def create_model(self, batch_size, epochs, dropout_rate, learning_rate, dense_units):
        unique_values = np.unique(self.y)
        self.is_binary = len(unique_values) <= 2
        num_classes = len(unique_values)

        inputs = Input(shape=(self.X_train.shape[1],))
        x = inputs

        for i, units in enumerate(dense_units):
            x = Dense(units, kernel_regularizer=l2(0.001), activation="relu")(x)
            x = Dropout(dropout_rate)(x)
            
            if i % 2 != 0:
                x = BatchNormalization()(x)

        if self.is_binary:
            outputs = Dense(1, activation='sigmoid')(x)
            loss = 'binary_crossentropy'
        else:
            outputs = Dense(num_classes, activation='softmax')(x)
            loss = 'sparse_categorical_crossentropy'

        self.model = tf.keras.Model(inputs=inputs, outputs=outputs)
        self.model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=learning_rate),
            loss=loss,
            metrics=['accuracy']
        )

    def train_model(self, batch_size, epochs, dropout_rate, learning_rate, dense_units, testing=False):
        self.create_model(batch_size, epochs, dropout_rate, learning_rate, dense_units)

        self.epoch_data = []
        self.current_val_acc = 0
        self.epoch_info_queue = queue.Queue()

        class CustomCallback(Callback):
            def __init__(self, outer_instance):
                super().__init__()
                self.outer_instance = outer_instance

            def on_epoch_end(self, epoch, logs=None):
                test_loss, test_acc = self.model.evaluate(
                    self.outer_instance.X_test, 
                    self.outer_instance.y_test, 
                    verbose=0
                )
                train_loss, train_acc = logs['loss'], logs['accuracy']

                epoch_info = {
                    "epoch": epoch + 1,
                    "train_loss": train_loss,
                    "train_acc": train_acc,
                    "test_loss": test_loss,
                    "test_acc": test_acc
                }
                self.outer_instance.epoch_data.append(epoch_info)
                self.outer_instance.current_epoch_info = epoch_info
                self.outer_instance.epoch_info_queue.put(epoch_info)
                
                if testing == False:
                    print(epoch_info, end='\n')
                    # print('\n')

                if test_acc > self.outer_instance.current_val_acc and testing == False:
                    self.outer_instance.save_model()
                    self.outer_instance.current_val_acc = test_acc
                    print(f"New best model saved with validation accuracy: {test_acc}", end='\n')
                    
                if test_acc > self.outer_instance.current_val_acc and testing == True:
                    self.outer_instance.current_val_acc = test_acc

        custom_callback = CustomCallback(self)
        
        final_epochs = epochs if testing else self.hyperparameters["epochs"]
        
        history = self.model.fit(
            self.X_train, self.y_train,
            epochs=final_epochs,
            batch_size=batch_size,
            validation_data=(self.X_test, self.y_test),
            callbacks=[custom_callback],
            verbose=0
        )
        
        return history

    def evaluate_model(self):
        y_pred_proba = self.model.predict(self.X_test, verbose=0)
        if self.is_binary:
            y_pred = (y_pred_proba > 0.5).astype(int)
        else:
            y_pred = np.argmax(y_pred_proba, axis=1)
        self.accuracy = accuracy_score(self.y_test, y_pred)
        return self.accuracy

    def save_model(self):
        if not os.path.exists(self.directory_path):
            os.makedirs(self.directory_path)
            
        self.model.save(self.complete_model_path)
        joblib.dump(self.scaler, self.complete_scaler_path)
        joblib.dump(self.label_encoders, self.complete_label_encoder_path)

    def hyperparameter_tuning(self, param_grid):
        best_accuracy = 0
        best_params = None

        param_combinations = list(product(*param_grid.values()))
        total_combinations = len(param_combinations)
        
        print(f"Starting hyperparameter tuning with {total_combinations} combinations")
        
        for i, params in enumerate(param_combinations, 1):
            params_dict = dict(zip(param_grid.keys(), params))
            print(f"Training combination {i}/{total_combinations}: {params_dict}")
            
            self.train_model(**params_dict, testing=True)
            accuracy = self.evaluate_model()

            if accuracy > best_accuracy:
                best_accuracy = accuracy
                best_params = params_dict
                print(f"New best accuracy: {best_accuracy:.4f}")

        print(f"Best accuracy: {best_accuracy:.4f} with parameters: {best_params}")
        return best_params

    def execute(self):
        # param_grid = {
        #     "batch_size": [32],
        #     "epochs": [2],
        #     "dropout_rate": [0.15, 0.3, 0.45],
        #     "learning_rate": [0.01, 0.001],
        #     "dense_units": [(1024, 512, 128, 64, 32), (512, 128, 64, 32), 
        #                   (256, 128, 64, 32), (128, 64, 32)]  
        # }
        param_grid = {
            "batch_size": [32],
            "epochs": [2],
            "dropout_rate": [0.15],
            "learning_rate": [0.01, 0.001],
            "dense_units": [(128, 64, 32)]  
        }

        best_params = self.hyperparameter_tuning(param_grid)
        print(f"Training final model with best parameters: {best_params}")
        
        history = self.train_model(**best_params)
        final_accuracy = self.evaluate_model()
        print(f"Final model accuracy: {final_accuracy:.4f}")
        
        data = list(self.df.drop(columns=[self.target_col]).values)[0] 
        
        formatted_dat = [f"'{item}'" if isinstance(
            item, str) else str(item) for item in data]
        
        
        interference_code = f'''
import os
import pandas as pd
import numpy as np
import joblib
from tensorflow.keras.models import load_model

def load_model_from_local(model_path):
    return load_model(model_path)

def load_scaler_from_local(scaler_path):
    return joblib.load(scaler_path)

def load_label_encoders_from_local(label_encoder_path):
    return joblib.load(label_encoder_path)

def preprocess_input(data, scaler, label_encoders, column_names):
    df = pd.DataFrame([data], columns=column_names)
    
    for column, le in label_encoders.items():
        df[column] = le.transform(df[column])
    
    data_scaled = scaler.transform(df)
    return data_scaled

def make_predictions(model, data_scaled):
    predictions_proba = model.predict(data_scaled)
    if predictions_proba.shape[1] == 1:  # Binary classification
        predictions = (predictions_proba > 0.5).astype(int)
    else:  # Multi-class classification
        predictions = np.argmax(predictions_proba, axis=1)
    return predictions, predictions_proba

def infer(input_data, model_name, scaler_name, label_encoder_name, dataset_path):
    model_path = model_name
    scaler_path = scaler_name
    label_encoder_path = label_encoder_name

    model = load_model_from_local(model_path)
    scaler = load_scaler_from_local(scaler_path)
    label_encoders = load_label_encoders_from_local(label_encoder_path)

    if model and scaler:
        df = pd.read_csv(dataset_path, encoding='{self.encoding}')
        target_idx = df.columns.get_loc('{self.target_col}')
        column_names = df.drop(columns=['{self.target_col}']).columns.tolist()

        
        y = df['{self.target_col}']

        data_scaled = preprocess_input(input_data, scaler, label_encoders, column_names)

        predictions, predictions_proba = make_predictions(model, data_scaled)

        if predictions_proba.shape[1] == 1:  # Binary classification
            pred = None
            if y.dtype == object:  
                    pred = label_encoders["target"].inverse_transform(predictions)[0]
            else:
                    pred = int(predictions[0][0])
            return {{
                    "prediction": [
                        {{"predicted_class": pred}},
                        {{"probability": float(predictions_proba[0][0])}}
                    ]
                }}    
        else:  # Multi-class classification
            if y.dtype == object: 
                pred = label_encoders["target"].inverse_transform([predictions[0]])[0]
                return {{
                        "prediction": [
                            {{"predicted_class": pred}},
                            {{"probabilities": predictions_proba[0].tolist()}}
                        ]
                    }}    
            else:
                return {{
                        "prediction": [
                           {{"predicted_class": [predictions[0]][0]}},
                            {{"probabilities": predictions_proba[0].tolist()}}
                        ]
                    }}  

    else:
        raise ValueError("Failed to load model or scaler.")

def predict(input_data):
    input_data = input_data
    model_name = '{self.complete_model_path}'
    scaler_name = '{self.complete_scaler_path}'
    label_encoder_name = '{self.complete_label_encoder_path}'
    dataset_url = '{self.dataset_url}'

    result = infer(input_data, model_name, scaler_name, label_encoder_name, dataset_url)
    print(result)
'''
        file_path = os.path.join(self.complete_path, f'_inference.py')
        with open(file_path, 'w') as file:
            file.write(interference_code)
            
        logs = {
            'task': 'Classification',
            'name': self.model_name,
            'model': self.complete_model_path,
            'scaler': self.complete_scaler_path,
            'label_encoder': self.complete_label_encoder_path,
            'last_epoch': self.epoch_data[-1],
            'inference': file_path,
            'dataset': self.dataset_url,
            'columns': list(self.df.columns)[0:-1],
            'row': self.df.drop(columns=[self.target_col]).iloc[0].tolist()
        }
        
        def convert_to_serializable(obj):
            if isinstance(obj, np.generic):
                return obj.item()
            elif isinstance(obj, dict):
                return {k: convert_to_serializable(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_to_serializable(i) for i in obj]
            else:
                return obj

        logs = convert_to_serializable(logs)
        print(logs)
        
        logs_path = os.path.join(self.complete_path, f'logs.json')
        
        with open(logs_path, 'w') as f:
            json.dump(logs, f, indent=4)
            
        return self.epoch_data
