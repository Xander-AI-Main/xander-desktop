
import numpy as np
import pandas as pd
import tensorflow as tf
import joblib
import os

def make_prediction(input_data, model_path, scaler_path, label_encoder_path, dataset_url):
    model = tf.keras.models.load_model(model_path)
    scaler = joblib.load(scaler_path)
    label_encoders = joblib.load(label_encoder_path)
    
    df_original = pd.read_csv(dataset_url, encoding='ascii')
    
    feature_columns = df_original.columns.drop(['quality']).tolist()
    
    if len(input_data) != len(feature_columns):
        raise ValueError(f"Input data must have {len(feature_columns)} features. Got {len(input_data)} instead.")
    
    input_df = pd.DataFrame([input_data], columns=feature_columns)
    
    for column, encoder in label_encoders.items():
        if column in input_df.columns: 
            try:
                input_df[column] = encoder.transform(input_df[column])
            except ValueError:
                most_frequent_category = encoder.classes_[0]
                input_df[column] = input_df[column].map(lambda x: x if x in encoder.classes_ else most_frequent_category)
                input_df[column] = encoder.transform(input_df[column])
    
    scaled_data = scaler.transform(input_df)
    
    prediction = model.predict(scaled_data)
    
    return {
            "prediction": [
                {"predicted_value": float(prediction[0][0])}
            ]
        }

if __name__ == "__main__":
    input_data = [7.4, 0.7, 0.0, 1.9, 0.076, 11.0, 34.0, 0.9978, 3.51, 0.56, 9.4]
    model_name = 'models/0.7210312786720221.h5'
    scaler_name = 'models/scaler_0.7210312786720221.pkl'
    label_encoder_name = 'models/label_encoder_0.7210312786720221.pkl'
    dataset_url = '/home/atulitgaur/.config/electron-react-boilerplate/uploads/winequality-red.csv'
    
    result = make_prediction(input_data, model_name, scaler_name, label_encoder_name, dataset_url)
    print(result)        
        