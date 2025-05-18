import { useState } from "react";
import Dialogue from "./components/Dialogue";
import NavBar from "./components/NavBar";
import Settings from "./components/Settings";
import WeatherContainer from "./components/WeatherContainer";
// Import the SettingsData type or interface from the correct file
import type { SettingsData } from "./components/Settings";

function App() {
  const [settings, setSettings] = useState<SettingsData | null>({
    location: null,
    clock: "clock12Hr",
    degree: "degreeF",
  });

  return (
    <>
      <Settings setSettings={setSettings} currentSettings={settings} />
      <NavBar
        onSettingsClick={() => {
          const settingsModal = document.querySelector(
            "#settingsModal"
          ) as HTMLElement;
          settingsModal.classList.add("show");
          settingsModal.style.display = "block";
        }}
      />
      <div className="row gap-1">
        <WeatherContainer
          settings={
            settings ?? {
              location: null,
              clock: "clock12Hr",
              degree: "degreeF",
            }
          }
        />
        <Dialogue />
      </div>
    </>
  );
}

export default App;
