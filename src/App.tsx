import { useState, useEffect } from "react";
import Dialogue from "./components/Dialogue";
import NavBar from "./components/NavBar";
import Settings from "./components/Settings";
import WeatherContainer from "./components/WeatherContainer";
import type { SettingsData } from "./components/Settings";
import { forecastToDialogueCategory } from "./components/CharacterDialogues";

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

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const body = document.body;
      const htmlElement = document.querySelector("html");
      let category = forecastToDialogueCategory(forecast ?? "", currentTime);

      // Determine if it's night (8pm to 6am)
      const hour = currentTime.getHours();
      const isNight = hour >= 20 || hour < 6;

      if (
        category === "raining" ||
        category === "foggy" ||
        category === "windy"
      ) {
        // Treat raining/foggy/windy as stormy
        body.style.background = "var(--stormtime)";
        if (htmlElement) htmlElement.style.background = "var(--stormcolor)";
        body.className = "storm";
      } else if (category === "snowy") {
        body.style.background = "var(--snowytime)";
        if (htmlElement) htmlElement.style.background = "var(--snowycolor)";
        body.className = "snowy";
      } else if (isNight) {
        body.style.background = "var(--nighttime)";
        if (htmlElement) htmlElement.style.background = "var(--nightcolor)";
        body.className = "dark";
      } else {
        body.style.background = "var(--daytime)";
        if (htmlElement) htmlElement.style.background = "var(--daycolor)";
        body.className = "light";
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [forecast]);

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
