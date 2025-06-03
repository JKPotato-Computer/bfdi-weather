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
  const [forecast, setForecast] = useState<string | undefined>(undefined);

  useEffect(() => {
    const saved = localStorage.getItem("settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSettings: React.Dispatch<
    React.SetStateAction<SettingsData | null>
  > = (value) => {
    setSettings((prev) => {
      const newSettings = typeof value === "function" ? value(prev) : value;
      if (newSettings) {
        localStorage.setItem("settings", JSON.stringify(newSettings));
      }
      return newSettings;
    });
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
          onForecastUpdate={setForecast}
        />
        <Dialogue forecast={forecast} />
      </div>
    </>
  );
}

export default App;
