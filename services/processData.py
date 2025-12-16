# Import CSV module for handling CSV files
import csv
import string

# Function to read csv file into rows
file_path = './data/torontoCrimeData.csv'
def read_csv(file_path):
    with open(file_path, mode='r', newline='', encoding='utf-8') as f:
        rows = list(csv.reader(f))
        header = rows[0] if rows else []
    return header, rows[1:]

# Get value at specific row and column
def get_value(rows, row_idx, col_idx):
    return rows[row_idx][col_idx] if 0 <= row_idx < len(rows) and 0 <= col_idx < len(rows[0]) else None

# Read the CSV file
header, rows = read_csv(file_path)

# Dictionary to hold crime value per neighbourhood
crimeValuePerNeighbourhood = {}
# Calculate crime value per neighbourhood
for i, row in enumerate(rows):
    try:
        # Neighbourhood name
        neighbourhood_name = str(row[1])
        # Population (column 18)
        popValue = int(row[18])
        # Crime values from the last 3 years (columns 3–17)
        total_crime = sum(int(row[j]) for j in range(3, 18))
        # Crime rate per 1000 population
        crime_rate = total_crime / popValue * 1000
        # Store in dictionary by name
        crimeValuePerNeighbourhood[neighbourhood_name] = crime_rate
    except ValueError:
        print(f"Row {i} contains non-numeric data in columns 3-18.")

# Test print the crime values per neighbourhood 1-3 
# for i in range(3):
#     neighbourhood_name = str(rows[i][1])
#     print(f"{neighbourhood_name} - crime value: {crimeValuePerNeighbourhood[neighbourhood_name]}")

