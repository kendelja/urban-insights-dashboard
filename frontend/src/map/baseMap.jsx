// src/map/BaseMap.jsx
// Import necessary libraries and components
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getNeighbourhoods } from "../api/getData";
import { useEffect, useState } from "react";
import { Polygon } from "react-leaflet";
import { Tooltip } from "react-leaflet";
// Import custom CSS for styling
import "./baseMapStyle.css";

export default function BaseMap() {
  // State to hold neighbourhood data and hovered polygon ID
  const [neighbourhoods, setNeighbourhoods] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  // Fetch neighbourhood data on component mount
  useEffect(() => {
    getNeighbourhoods()
      .then((data) => {
        console.log("Fetched successfully");
        //console.log("Neighbourhoods from backend:", data);
        setNeighbourhoods(data);
      })
      .catch((err) => {
        console.error("Failed to load neighbourhoods:", err);
      });
  }, []);

  return (
    // Render the map container with polygons for each neighbourhood
    <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
      <MapContainer
        center={[43.6532, -79.3832]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={15}
          minZoom={10}
          detectRetina={false}
          errorTileUrl="https://via.placeholder.com/256?text=no+tile"
        />
        {/* Render polygons for each neighbourhood */}
        {neighbourhoods.map((n, i) => {
          // Skip null polygons
          if (!n?.polygon?.length) return null;
          // Convert [lng, lat] to [lat, lng] for Leaflet
          const positions = n.polygon.map((ring) => ring.map(([lng, lat]) => [lat, lng]));
          // Normalize crime score for color mapping
          const minScore = 0;
          const maxScore = 131;
          const normalize = (score) => (score - minScore) / (maxScore - minScore);
          // Map crime score to color
          const crimeColor = (score) => {
            const t = normalize(score); // 0 bad / 1 good
            const hue = (1 - t) * 120; // 120 = green, 0 = red
            return `hsl(${hue}, 80%, 42%)`;
          };
          // Check if current polygon is hovered
          const isHovered = hoveredId === i;
          return (
            // Render each polygon with appropriate styles and event handlers
            <Polygon
              key={i}
              positions={positions}
              crimeScore={n.crime_score}
              pathOptions={{
                // Color each according to crime_score, increase nbrhd weight on hover
                fillColor: crimeColor(n.crime_score),
                fillOpacity: 0.7 + normalize(n.crime_score) * 0.9,
                color: isHovered ? "#ffffff" : "#000000",
                weight: isHovered ? 4 : 1.5,
                opacity: 0.8,
                clickable: true,
              }}
              //  Handle mouseover and mouseout events to set hovered ID
              eventHandlers={{
                mouseover: () => setHoveredId(i),
                mouseout: () => setHoveredId(null),
              }}
            >
              {/* Tooltip for neighbourhood name when zoomed out */}
              {MapContainer.zoom < 13 && <Tooltip>{n.neighbourhood}</Tooltip>}
              {/* Detailed tooltip card displaying name, color code, and crime score on hover */}
              {isHovered && (
                <Tooltip permanent direction="top" className="neighbourhood-hover-tooltip" width={200} height={150}>
                  <div style={{ textAlign: "center", width: 200, height: 150 }}>
                    <strong>{n.neighbourhood}</strong>
                    <div
                      style={{
                        height: 10,
                        width: 150,
                        margin: "6px auto 8px",
                        borderRadius: 2,
                        backgroundColor: crimeColor(n.crime_score),
                      }}
                    />
                    <div>
                      <span style={{ fontWeight: 600 }}>Crime score:</span> <span>{n.crime_score}</span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.8em",
                        opacity: 0.8,
                        marginTop: 8,
                        marginBottom: 0,
                        lineHeight: "1.3",
                        textAlign: "center",
                      }}
                    >
                      Calculated from combined counts of break-ins, vehicle thefts, weapons incidents, and other crime
                      types, then normalized by the neighbourhood population (range: 0–131).
                    </p>
                  </div>
                </Tooltip>
              )}
            </Polygon>
          );
        })}
      </MapContainer>
    </div>
  );
}
