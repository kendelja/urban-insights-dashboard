
import json
from services.processData import crimeValuePerNeighbourhood 
# Initalize crime dictionary
crimeValues = crimeValuePerNeighbourhood

# Load the GeoJSON
with open("./data/toronto_crs84_clean.geojson") as f:
    geo = json.load(f)

def merge_data(geojson, crimeValues):
    merged = []

    for feature in geojson['features']:
        neighbourhood = feature['properties']['AREA_NAME']
        crime = crimeValues.get(neighbourhood, 0)
        polygon = feature['geometry']['coordinates']
        crimeInt = int(crime)
        merged.append({
            "neighbourhood": neighbourhood,
            "crime_score": crimeInt,
            "polygon": polygon
        })

    return merged

mergedData = merge_data(geo, crimeValues)

# Save merged data to a new JSON file
with open("merged_crime_data.json", "w") as outfile:
    json.dump(mergedData, outfile)