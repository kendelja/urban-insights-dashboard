// src/map/BaseMap.jsx
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getNeighbourhoods } from "../api/getData";
import { useEffect, useState } from "react";
import { Polygon } from "react-leaflet";
import { Tooltip } from "react-leaflet";

import "./baseMapStyle.css";

export default function BaseMap() {
  const [neighbourhoods, setNeighbourhoods] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

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
          maxZoom={19}
          minZoom={12}
          detectRetina={false}
          errorTileUrl="https://via.placeholder.com/256?text=no+tile"
        />
        {neighbourhoods.map((n, i) => {
          if (!n?.polygon?.length) return null;

          const positions = n.polygon.map((ring) => ring.map(([lng, lat]) => [lat, lng]));
          const minScore = 0;
          const maxScore = 125;
          const normalize = (score) => (score - minScore) / (maxScore - minScore);

          const crimeColor = (score) => {
            const t = normalize(score); // 0 bad / 1 good
            const hue = (1 - t) * 120; // 120 = green, 0 = red
            return `hsl(${hue}, 80%, 42%)`;
          };
          const isHovered = hoveredId === n.id;

          return (
            <Polygon
              key={i}
              positions={positions}
              crimeScore={n.crime_score}
              displayName={n.neighbourhood}
              printName={n.neighbourhood}
              pathOptions={{
                fillColor: crimeColor(n.crime_score),
                fillOpacity: 0.9,
                color: isHovered ? "#898989ff" : "#000000ff",
                weight: isHovered ? 3 : 0.5,
                opacity: 0.8,
                clickable: true,
              }}
              eventHandlers={{
                mouseover: () => setHoveredId(n.id),
                mouseout: () => setHoveredId(null),
              }}
            >
              <Tooltip permanent direction="center" className="neighbourhood-label">
                {n.neighbourhood}
              </Tooltip>
            </Polygon>
          );
        })}
      </MapContainer>
    </div>
  );
}
