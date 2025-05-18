import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.css";

import "./css/App.css";
import "./css/NavBar.css";
import "./css/WeatherContainer.css";
import "./css/Dialogue.css";
import "./css/Character.css";
import "./css/Settings.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
