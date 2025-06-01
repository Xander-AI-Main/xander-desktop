
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
    
    feature_columns = df_original.columns.drop(['Class']).tolist()
    
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
    input_data = [0.02, 0.0371, 0.0428, 0.0207, 0.0954, 0.0986, 0.1539, 0.1601, 0.3109, 0.2111, 0.1609, 0.1582, 0.2238, 0.0645, 0.066, 0.2273, 0.31, 0.2999, 0.5078, 0.4797, 0.5783, 0.5071, 0.4328, 0.555, 0.6711, 0.6415, 0.7104, 0.808, 0.6791, 0.3857, 0.1307, 0.2604, 0.5121, 0.7547, 0.8537, 0.8507, 0.6692, 0.6097, 0.4943, 0.2744, 0.051, 0.2834, 0.2825, 0.4256, 0.2641, 0.1386, 0.1051, 0.1343, 0.0383, 0.0324, 0.0232, 0.0027, 0.0065, 0.0159, 0.0072, 0.0167, 0.018, 0.0084, 0.009, 0.0032]
    model_name = 'models/amber-octopus/amber-octopus.h5'
    scaler_name = 'models/amber-octopus/scaler_amber-octopus.pkl'
    label_encoder_name = 'models/amber-octopus/label_encoder_amber-octopus.pkl'
    dataset_url = '/home/atulitgaur/.config/electron-react-boilerplate/uploads/Sonar1(1).csv'
    
    result = make_prediction(input_data, model_name, scaler_name, label_encoder_name, dataset_url)
    print(result)        
        