import os
import json
import pandas as pd
import importlib.util
import os
import functools
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
print = functools.partial(print, flush=True)

def return_model(name):
    if not os.path.exists('models'):
        return {}
    else:
        dirs = os.listdir('models')
        data = {}
        
        for dir in dirs:
            if dir == name:
                path = os.path.join('models', dir, 'logs.json')
                with open(path, 'r') as f:
                    curr = json.load(f)
                data = curr
            
        return {"data": data}       
    
def predict(name, input_data):
    module_path = os.path.join('models', name, '_inference.py')

    spec = importlib.util.spec_from_file_location("inference_module", module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

    if hasattr(module, "predict"):
        return module.predict(input_data)
    else:
        raise AttributeError(f"No 'predict' found in {module_path}")