// src/map/BaseMap.jsx
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function BaseMap() {
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
          // reduce requests from high-DPI devices
          detectRetina={false}
          // show placeholder if a tile fails
          errorTileUrl="https://via.placeholder.com/256?text=no+tile"
        />
      </MapContainer>
    </div>
  );
}
