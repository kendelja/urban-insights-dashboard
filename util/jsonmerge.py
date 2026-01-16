
# import json
# import csv
# from processData import crimeValuePerNeighbourhood
# # Initalize crime dictionary
# crimeValues = crimeValuePerNeighbourhood

# populationValues = {}
# with open("./data/torontoCrimeData.csv", newline="", encoding="utf-8") as f:
#     reader = csv.DictReader(f)
#     for row in reader:
#         neighbourhood = row["NEIGHBOURHOOD_NAME"]
#         population = int(row["POPULATION_2024"])
#         populationValues[neighbourhood] = population

# # Load the GeoJSON
# with open("./data/toronto_crs84_clean.geojson") as f:
#     geo = json.load(f)

# def merge_data(geojson, crimeValues, populationValues):
#     merged = []

#     for feature in geojson['features']:
#         neighbourhood = feature['properties']['AREA_NAME']
#         crime = crimeValues.get(neighbourhood, 0)
#         polygon = feature['geometry']['coordinates']
#         crimeInt = int(crime)
#         population = populationValues.get(neighbourhood, None)
#         merged.append({
#             "neighbourhood": neighbourhood,
#             "crime_score": crimeInt,
#             "population": population,
#             "polygon": polygon
#         })

#     return merged

# mergedData = merge_data(geo, crimeValues, populationValues)

# # Save merged data to a new JSON file
# with open("merged_crime_data.json", "w") as outfile:
#     json.dump(mergedData, outfile)