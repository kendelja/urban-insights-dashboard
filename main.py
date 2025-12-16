# from pathlib import Path
# import tkinter as tk
# import folium
# import json
# from tkinterweb import HtmlFrame
# #import dictionary from data.py
# from services.processData import crimeValuePerNeighbourhood 

# # Initalize crime dictionary
# crimeValuePerNeighbourhood = crimeValuePerNeighbourhood

# def clear_frame():
#     for widget in root.winfo_children():
#         widget.destroy()

# def citySelectionScreen():
#     clear_frame()
#     # Menu selection screen 
#     menu_label = tk.Label(root, text="Select an option:", bg="#f0f0f0", font=("Arial", 14))
#     menu_label.pack(pady=20)        
#     # City selection button
#     city_button = tk.Button(root, text="Toronto", command=lambda: mainScreen() , bg="#4CAF50", fg="white", font=("Arial", 12))
#     city_button.pack(pady=10)
#     # Exit button
#     exit_button = tk.Button(root, text="Exit", command=root.quit, bg="#FF5733", fg="white", font=("Arial", 12))
#     exit_button.pack(pady=10)

# def mainScreen():
#     clear_frame()
#     # Main screen showing neighbourhoods and their crime values
#     title_label = tk.Label(root, text="Neighbourhood Rating V1", bg="#f0f0f0", font=("Arial", 16))
#     title_label.pack(pady=10)
#      # Exit button
#     exit_button = tk.Button(root, text="Exit", command=root.quit, bg="#FF5733", fg="white", font=("Arial", 12))
#     exit_button.pack(pady=10)


#     # Load geojson
#     with open("toronto_crs84.geojson") as f:
#         data = json.load(f)
#     # Create map
#     m = folium.Map(location=[43.651070, -79.347015], zoom_start=11)
#     # Add choropleth (colored areas)
#     folium.Choropleth(
#         geo_data=data,
#         data=crimeValuePerNeighbourhood,  # dict of {neighbourhood: crime_rate}
#         key_on="feature.properties.AREA_NAME",  # verify this exists in your geojson
#         fill_color="YlOrRd",
#         name="Crime Rate"
#     ).add_to(m)

#     m.save("toronto_crime_map.html")
#     map_path = Path("toronto_crime_map.html").resolve()   # absolute path


#     # Display using HtmlFrame (renders full HTML)
#     html_frame = HtmlFrame(root, horizontal_scrollbar="auto")
#     html_frame.load_file(str(map_path))
#     html_frame.pack(fill="both", expand=True)



#     # with open("toronto_crime_map.html", "r", encoding="utf-8") as f:
#     #     html = f.read()
#     # label = HTMLLabel(root, html=html)
#     # label.pack(fill="both", expand=True)
#     # import webbrowser
#     # webbrowser.open("toronto_crime_map.html")
    




# # Create main application window
# root = tk.Tk()
# root.title("Neighbourhoods")
# root.geometry("800x800")
# root.configure(bg="#f0f0f0")
# citySelectionScreen()
# # Start the Tkinter event loop
# root.mainloop()

# main.py
from fastapi import FastAPI
from routers import neighbourhoods

app = FastAPI()

app.include_router(neighbourhoods.router)