import { useEffect, useState, useRef } from "react";
import WeatherIcon from "./WeatherIcon";
import DataChart from "./DataChart";
import TimeContainer from "./TimeContainer";
import type { SettingsData } from "./Settings";
import type { WeatherData } from "./weatherApi";
import {
  fetchWeatherData,
  readWeatherData,
  getLastUpdatedTime,
} from "./weatherApi";

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
  const [errorReason, setErrorReason] = useState(undefined);
  const [chartDataType, setChartDataType] = useState<
    "temperature" | "humidity" | "precipitation"
  >("temperature");
  const [referenceValues, setReferenceValues] = useState<WeatherData | null>(
    null
  );

  const lastForecastRef = useRef<string | null>(null);
  const prevLoadingRef = useRef<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [newStandardData, newWeatherData, newErrorReason] =
        await fetchWeatherData(settings);
      setStandardData(newStandardData);
      setWeatherData(newWeatherData);
      setErrorReason(newErrorReason);

      let refVals: WeatherData | null = null;
      if (newWeatherData) {
        try {
          refVals = await readWeatherData(newWeatherData, settings);
        } catch (e) {
          refVals = null;
        }
      }

      setReferenceValues(refVals);
      setLoading(false);
    }
    loadData();
  }, [refresh, settings]);

  // Only notify Dialogue if forecast actually changed and loading is done
  useEffect(() => {
    // Only run when loading transitions from true to false
    if (
      onForecastUpdate &&
      referenceValues &&
      prevLoadingRef.current && // was loading before
      !loading // now not loading
    ) {
      lastForecastRef.current = referenceValues.currently.forecast;
      onForecastUpdate(referenceValues.currently.forecast);
    }
    prevLoadingRef.current = loading;
  }, [loading, referenceValues, onForecastUpdate]);

  // Helper for loading UI
  function LoadingUI({ is12Hour }: { is12Hour: boolean }) {
    return (
      <div className="col d-flex flex-column gap-3" id="timeWeatherHolder">
        <TimeContainer is12Hour={is12Hour} />
        <div
          className="container standardComponent rounded-4"
          id="weatherContainer"
        >
          <div className="fs-1 p-4 text-center">Loading weather...</div>
        </div>
      </div>
    );
  }

  // Helper for error UI
  function ErrorUI({
    is12Hour,
    errorReason,
    onRefresh,
  }: {
    is12Hour: boolean;
    errorReason: any;
    onRefresh: () => void;
  }) {
    return (
      <div
        className="col d-flex flex-column align-items-start gap-3"
        id="timeWeatherHolder"
      >
        <TimeContainer is12Hour={is12Hour} />
        <div
          className="container standardComponent rounded-4 p-4"
          id="weatherContainer"
        >
          <div className="alert alert-danger" role="alert">
            <div className="row">
              <div className="col flex-grow-1 d-flex flex-row align-items-center gap-2">
                <span className="material-symbols-rounded fs-3">error</span>
                <span className="fs-3">
                  <b>uh oh!</b> it failed...
                </span>
              </div>
              <div className="col">
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center gap-3 ms-auto"
                  onClick={onRefresh}
                >
                  <span className="material-symbols-rounded">refresh</span>{" "}
                  Refresh
                </button>
              </div>
            </div>
            <div className="row">
              <hr className="m-2" />
              <span>reason: {errorReason}</span>
            </div>
          </div>

          {errorReason === "UnsupportedLocation" && (
            <ul className="text-start fs-6">
              <li>
                this site uses the National Weather Service API, which only
                provides weather data for the United States and its territories
              </li>
              <li>
                your current location appears to be outside of these supported
                areas so... rip ig
              </li>
            </ul>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingUI is12Hour={settings.clock === "clock12Hr"} />;
  }

  if (
    currentWeatherData == null ||
    (currentWeatherData != null &&
      Object.keys(currentWeatherData).length === 0) ||
    errorReason == undefined
  ) {
    return (
      <ErrorUI
        is12Hour={settings.clock === "clock12Hr"}
        errorReason={errorReason}
        onRefresh={() => setRefresh(!refresh)}
      />
    );
  }

  if (!referenceValues) {
    return <LoadingUI is12Hour={settings.clock === "clock12Hr"} />;
  }

  return (
    <div className="col d-flex flex-column gap-3" id="timeWeatherHolder">
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
            <span
              className="ms-auto fs-4 mb-5 text-end lh-s"
              id="smallForecast"
            >
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

          <div className="btn-group mt-3" id="chartTypeSelector">
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
            Source: National Weather Service (
            {currentStandardData.properties.relativeLocation.properties.city},{" "}
            {currentStandardData.properties.relativeLocation.properties.state})
            -
            {" " +
              new Date(getLastUpdatedTime()).toLocaleTimeString("en-us", {
                hour12: settings.clock === "clock12Hr",
              })}
          </span>
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-3"
            onClick={() => {
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
