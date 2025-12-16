# services/neighbourhood_service.py
import json
from pathlib import Path

DATA_FILE = Path(__file__).parent.parent / "data" / "torontoData.json"

def get_neighbourhoods():
    with open(DATA_FILE) as f:
        data = json.load(f)
    # you can add any preprocessing here if needed
    return data