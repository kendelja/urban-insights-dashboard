import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import BaseMap from "./map/baseMap.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BaseMap />
  </StrictMode>
);
