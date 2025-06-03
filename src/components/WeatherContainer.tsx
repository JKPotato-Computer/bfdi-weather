import { useEffect, useState } from "react";
import WeatherIcon from "./WeatherIcon";
import DataChart from "./DataChart";
import TimeContainer from "./TimeContainer";
import type { SettingsData } from "./Settings";
import type { WeatherData } from "./weatherApi";
import { fetchWeatherData, readWeatherData } from "./weatherApi";

interface WeatherContainerProps {
  settings: SettingsData;
  onForecastUpdate?: (forecast: string) => void;
}

function WeatherContainer({
  settings,
  onForecastUpdate,
}: WeatherContainerProps) {
  const [loading, setLoading] = useState(true);
  const [currentStandardData, setStandardData] = useState<any>(null);
  const [currentWeatherData, setWeatherData] = useState<any>(null);
  const [refresh, setRefresh] = useState(false);
  const [unsupportedLocation, setUnsupportedLocation] = useState(false);
  const [chartDataType, setChartDataType] = useState<
    "temperature" | "humidity" | "precipitation"
  >("temperature");
  // Add a state for the processed weather data

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { currentStandardData, currentWeatherData, unsupportedLocation } =
        await fetchWeatherData(settings);
      setStandardData(currentStandardData);
      setWeatherData(currentWeatherData);
      setUnsupportedLocation(unsupportedLocation);
      setLoading(false);

      // Notify Dialogue of forecast update
      if (onForecastUpdate && currentWeatherData) {
        const referenceValues: WeatherData = readWeatherData(
          currentWeatherData,
          settings
        );
        onForecastUpdate(referenceValues.currently.forecast);
      }
    }
    loadData();
  }, [refresh, settings]);

  if (loading) {
    return (
      <div className="col d-flex flex-column gap-3">
        <TimeContainer is12Hour={settings.clock === "clock12Hr"} />
        <div
          className="container standardComponent rounded-4"
          id="weatherContainer"
        >
          <div className="fs-1 p-4 text-center">Loading weather...</div>
        </div>
      </div>
    );
  }

  if (
    currentWeatherData === null ||
    (currentWeatherData != null && Object.keys(currentWeatherData).length === 0)
  ) {
    return (
      <div className="col d-flex flex-column gap-3">
        <TimeContainer is12Hour={settings.clock === "clock12Hr"} />
        <div
          className="container standardComponent rounded-4"
          id="weatherContainer"
        >
          <div className="fs-1 pt-2 text-center">uh oh... it failed.</div>
          {unsupportedLocation && (
            <>
              <span className="text">
                <b>error: </b> current location unsupported! :(
              </span>
              <ul className="text-start fs-5">
                <li>
                  this site uses the National Weather Service API, which only
                  provides weather data for the United States and its
                  territories
                </li>
                <li>
                  your current location appears to be outside of these supported
                  areas so... rip ig
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    );
  }

  const referenceValues: WeatherData = readWeatherData(
    currentWeatherData,
    settings
  );

  return (
    <div className="col d-flex flex-column gap-3">
      <TimeContainer is12Hour={settings.clock === "clock12Hr"} />
      <div
        className="container standardComponent rounded-4 d-flex flex-column justify-content-between"
        id="weatherContainer"
        style={{ minHeight: "420px", height: "100%" }}
      >
        <div>
          <div className="container d-flex gap-3 flex-row align-items-center">
            <WeatherIcon forecast={referenceValues.currently.forecast} />
            <span className="text" id="currentTemperature">
              {settings.degree === "degreeC"
                ? referenceValues.currently.degree === "F"
                  ? Math.round(
                      ((referenceValues.currently.temperature - 32) * 5) / 9
                    )
                  : referenceValues.currently.temperature
                : referenceValues.currently.degree === "F"
                ? referenceValues.currently.temperature
                : Math.round(
                    (referenceValues.currently.temperature * 9) / 5 + 32
                  )}
            </span>
            <span className="fs-1 text mb-5" id="tempDegree">
              °{settings.degree === "degreeC" ? "C" : "F"}
            </span>
            <span className="ms-auto fs-4 mb-5 text-end lh-s">
              {referenceValues.currently.forecast}
            </span>
          </div>
          <div className="container d-flex flex-column justify-content-left">
            <span className="fs-3 text lh-sm">
              Precipitation: {referenceValues.currently.precipitation}%
            </span>
            <span className="fs-3 text lh-sm">
              Humidity: {referenceValues.currently.humidity}%
            </span>
            <span className="fs-3 text lh-sm">
              Wind: {referenceValues.currently.windSpeed}
            </span>
          </div>

          <div className="btn-group mt-3">
            <a
              href="#"
              className={
                "btn btn-primary" +
                (chartDataType == "temperature" ? " active" : "")
              }
              onClick={() => {
                setChartDataType("temperature");
              }}
            >
              Temperature
            </a>
            <a
              href="#"
              className={
                "btn btn-primary" +
                (chartDataType == "precipitation" ? " active" : "")
              }
              onClick={() => {
                setChartDataType("precipitation");
              }}
            >
              Precipitation
            </a>
            <a
              href="#"
              className={
                "btn btn-primary" +
                (chartDataType == "humidity" ? " active" : "")
              }
              onClick={() => {
                setChartDataType("humidity");
              }}
            >
              Humidity
            </a>
          </div>

          <DataChart
            periods={referenceValues.periods}
            is12Hour={settings.clock == "clock12Hr"}
            chartDataType={chartDataType}
          />
        </div>
        <div
          className="container d-flex flex-row justify-content-between align-items-center p-2 mt-0"
          style={{ marginTop: "auto" }}
        >
          <span className="text">
            <span
              style={{ backgroundColor: "rgb(128, 128, 64)" }}
              className="px-4 py-1 rounded-4 text text-center me-2"
            >
              WIP
            </span>
            National Weather Service (
            {currentStandardData.properties.relativeLocation.properties.city},{" "}
            {currentStandardData.properties.relativeLocation.properties.state})
            -
            {" " +
              new Date().toLocaleTimeString("en-us", {
                hour12: settings.clock === "clock12Hr",
              })}
          </span>
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-3"
            onClick={() => {
              console.log("Refreshing");
              setRefresh(!refresh);
            }}
          >
            <span className="material-symbols-rounded">refresh</span> Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

export default WeatherContainer;
