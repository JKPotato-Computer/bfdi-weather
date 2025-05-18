import { useState, useEffect } from "react";
import Dialogue from "./components/Dialogue";
import NavBar from "./components/NavBar";
import Settings from "./components/Settings";
import WeatherContainer from "./components/WeatherContainer";
import type { SettingsData } from "./components/Settings";

function App() {
  const [settings, setSettings] = useState<SettingsData | null>({
    city: "",
    state: "",
    useCurrentLocation: true,
    clock: "clock12Hr",
    degree: "degreeF",
  });

  useEffect(() => {
    const saved = localStorage.getItem("settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSettings = (newSettings: SettingsData) => {
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  };

  return (
    <>
      <Settings setSettings={updateSettings} currentSettings={settings} />
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
          key={JSON.stringify(settings)}
          settings={
            settings ?? {
              city: "",
              state: "",
              useCurrentLocation: true,
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
