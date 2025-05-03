import sys
import json
import importlib

def main():
    try:
        payload = json.loads(sys.stdin.read())
        module_name = payload['module']  
        func_name = payload['function']  
        args = payload.get('args', [])

        mod = importlib.import_module(module_name)
        func = getattr(mod, func_name)
        result = func(*args)

        print(json.dumps({ "result": result }))
    except Exception as e:
        print(json.dumps({ "error": str(e) }))

if __name__ == "__main__":
    main()
