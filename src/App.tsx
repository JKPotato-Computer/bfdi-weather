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
  const [refreshDialogue, setRefreshDialogue] = useState(false);

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
      <div className="row gap-3">
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
          onForecastUpdate={(newForecast) => {
            setForecast(newForecast);
            setRefreshDialogue((r) => !r);
          }}
        />
        <Dialogue
          forecast={forecast}
          refreshDialogue={refreshDialogue}
          onRefresh={() => setRefreshDialogue((r) => !r)}
        />
      </div>
    </>
  );
}

export default App;
