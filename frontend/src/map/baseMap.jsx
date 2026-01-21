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

//NOTE: Need to get the mask to work, right now nothing happening, want to dim outside polygons
// Component to render dimmed area outside neighbourhoods
const OutsideMask = ({ neighbourhoods }) => {
  // Outer rectangle covering the whole map
  const outerBounds = [
    [-90, -180],
    [-90, 180],
    [90, 180],
    [90, -180],
  ];

  // Convert neighbourhood polygons into holes
  const holes = neighbourhoods
    .filter((n) => n.polygon?.length)
    .map((n) => n.polygon.flat().map(([lng, lat]) => [lat, lng]));

  return (
    <Polygon
      positions={[outerBounds, ...holes]}
      pathOptions={{ fillColor: "rgba(255,255,255,0.85)", color: "transparent" }}
    />
  );
};
//NOTE

export default function BaseMap() {
  // State to hold neighbourhood data and hovered polygon ID
  const [neighbourhoods, setNeighbourhoods] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const labelZoomThreshold = 12;
  const [zoom, setZoom] = useState(labelZoomThreshold);

  // Overlay states
  const [showCrimeOverlay, setShowCrimeOverlay] = useState(true);
  const [showRentOverlay, setShowRentOverlay] = useState(false);

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

  const formatPopulation = (population) => {
    if (!population || population === 0) return "N/A";
    return population.toLocaleString();
  };

  const handleZoomEnd = (e) => {
    setZoom(e.target.getZoom());
  };

  const rentByBorough = {
    Downtown: {
      avg: 2871,
      beds: {
        one: 2090,
        two: 2864,
        three: 3660,
      },
    },
    York: {
      avg: 2578,
      beds: {
        one: 1885,
        two: 2458,
        three: 3392,
      },
    },
    "East York": {
      avg: 2679,
      beds: {
        one: 1895,
        two: 2537,
        three: 3607,
      },
    },
    Etobicoke: {
      avg: 2519,
      beds: {
        one: 2046,
        two: 2402,
        three: 3110,
      },
    },
    "North York": {
      avg: 2560,
      beds: {
        one: 2066,
        two: 2629,
        three: 2987,
      },
    },
    Scarborough: {
      avg: 2353,
      beds: {
        one: 1936,
        two: 2328,
        three: 2796,
      },
    },
  };

  //NEXT:
  //      Third overlay for average income or unit size by nbrhd/borough/district
  //      Dim outside of polygons when overlay is active to increase focus on data

  return (
    // Render the map container with polygons for each neighbourhood
    <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
      {/* // Legend for crime score color coding */}
      <div className="legend-container">
        {showCrimeOverlay ? (
          <>
            <div className="legend-title">Crime Score</div>
            {/* Gradient bar */}
            <div className="legend-gradient" />
            {/* Tick labels */}
            <div className="legend-scale">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100+</span>
            </div>
            <div className="legend-caption">Low crime → High crime</div>
            <div className="legend-description">
              Crime score is calculated from combined counts of break-ins, vehicle thefts, weapons incidents, and other
              crime types, normalized by neighbourhood population.
              <br />
              <span className="legend-range"> Range: 0 – 145</span>
            </div>
          </>
        ) : (
          <>
            <div className="legend-title">Average Rent</div>
            <div className="legend-gradient-rent" />
            {/* Tick labels */}
            <div className="legend-scale">
              <span>Under $2400</span>
              <span>$2400–2600</span>
              <span>$2600–2800</span>
              <span>$2800+</span>
            </div>
            <div className="legend-caption">Low rent → High rent</div>
            <div className="legend-description">
              Average rent is gathered from 2025 borough data, categorized at the borough level.
              <br />
              <span className="legend-range"> Range: $2300 – $2900</span>
            </div>
          </>
        )}
      </div>
      {/* // Overlay toggle buttons */}
      <div className="map-control-panel">
        <div className="panel-title">Toronto</div>
        <div className="panel-subtitle">Urban safety and housing cost insights</div>
        <div className="overlay-toggle">
          <button
            className={showCrimeOverlay ? "active" : ""}
            onClick={() => {
              setShowCrimeOverlay(true);
              setShowRentOverlay(false);
            }}
          >
            Crime
          </button>

          <button
            className={showRentOverlay ? "active" : ""}
            onClick={() => {
              setShowCrimeOverlay(false);
              setShowRentOverlay(true);
            }}
          >
            Rent
          </button>
        </div>
      </div>

      <MapContainer
        center={[43.6532, -79.3832]}
        zoom={12}
        minZoom={11}
        maxZoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        whenCreated={(map) => {
          map.on("zoomend", handleZoomEnd);
          setZoom(map.getZoom());
        }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={15}
          minZoom={10}
          detectRetina={false}
          errorTileUrl="https://via.placeholder.com/256?text=no+tile"
        />

        {/* Dim outside polygons */}
        {neighbourhoods.length > 0 && <OutsideMask neighbourhoods={neighbourhoods} />}
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

          const rentMin = 2300;
          const rentMax = 2900;

          const normalizeRent = (rent) => Math.min(1, Math.max(0, (rent - rentMin) / (rentMax - rentMin)));

          const rentColor = (avgRent) => {
            const t = normalizeRent(avgRent);
            const hue = 210 - t * 90; // blue → green
            return `hsl(${hue}, 70%, 45%)`;
          };

          // Check if current polygon is hovered
          const isHovered = hoveredId === i;
          const isHighCrime = n.crime_score > 100;

          const boroughRent = rentByBorough[n.borough];

          const fillColor = showCrimeOverlay
            ? crimeColor(n.crime_score)
            : boroughRent
              ? rentColor(boroughRent.avg)
              : "#ccc";

          const fillOpacity = showCrimeOverlay ? (isHighCrime ? 0.55 : 0.32) : 0.35;

          return (
            // Render each polygon with appropriate styles and event handlers
            <Polygon
              key={i}
              positions={positions}
              crimeScore={n.crime_score}
              pathOptions={{
                fillColor,
                fillOpacity,
                color: fillColor,
                weight: isHovered ? 3 : 2,
                opacity: 1,
              }}
              //  Handle mouseover and mouseout events to set hovered ID
              eventHandlers={{
                mouseover: () => setHoveredId(i),
                mouseout: () => setHoveredId(null),
              }}
            >
              {/* Tooltip for neighbourhood name when zoomed in */}
              {zoom > 13 && <Tooltip>{n.neighbourhood}</Tooltip>}
              {/* Detailed tooltip card displaying name, color code, and crime score on hover */}
              {isHovered && (
                <Tooltip permanent direction="right" className="neighbourhood-hover-tooltip">
                  <div style={{ textAlign: "center", width: 200 }}>
                    <strong>{n.neighbourhood}</strong>

                    {/* Color bar (crime or rent) */}
                    <div
                      style={{
                        height: 10,
                        width: 150,
                        margin: "6px auto 8px",
                        borderRadius: 2,
                        backgroundColor: showCrimeOverlay
                          ? crimeColor(n.crime_score)
                          : rentColor(rentByBorough[n.borough].avg),
                      }}
                    />

                    {/* Population */}
                    <div>
                      <span style={{ fontWeight: 600 }}>Population: </span>
                      <span>{formatPopulation(n.population)}</span>
                    </div>

                    {/* Main body */}
                    <div className="tooltip-body">
                      {showCrimeOverlay ? (
                        <div className="metric">
                          <span className="label" style={{ fontWeight: 600 }}>
                            Crime Score:{" "}
                          </span>
                          <span className="value">{n.crime_score}</span>
                        </div>
                      ) : (
                        <>
                          <div>
                            <span className="label" style={{ fontWeight: 600 }}>
                              Borough:{" "}
                            </span>
                            <span className="value">{n.borough}</span>
                          </div>
                          <div className="metric">
                            <span className="label" style={{ fontWeight: 600 }}>
                              Avg Rent:{" "}
                            </span>
                            <span className="value">${rentByBorough[n.borough].avg}</span>
                          </div>

                          <div className="rent-grid">
                            <br />
                            <div>
                              <span style={{ fontWeight: 600 }}>Rent by Bedroom:</span>
                            </div>
                            <div>
                              <div>
                                <span style={{ fontWeight: 600 }}>1 Bed: </span>
                                <span>${rentByBorough[n.borough].beds.one}</span>
                              </div>
                              <div>
                                <span style={{ fontWeight: 600 }}>2 Bed: </span>
                                <span>${rentByBorough[n.borough].beds.two}</span>
                              </div>
                              <div>
                                <span style={{ fontWeight: 600 }}>3 Bed: </span>
                                <span>${rentByBorough[n.borough].beds.three}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {/* Footer */}
                    <div className="tooltip-footer" style={{ fontSize: 9 }}>
                      {showCrimeOverlay ? "" : "Rent data categorized at borough level"}
                    </div>
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
