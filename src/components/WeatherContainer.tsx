import { useEffect, useState } from "react";
import WeatherIcon from "./WeatherIcon";
import TempChart from "./TempChart";
import TimeContainer from "./TimeContainer";
import type { SettingsData } from "./Settings";

interface WeatherContainerProps {
  settings: SettingsData;
}

function WeatherContainer({ settings }: WeatherContainerProps) {
  const [loading, setLoading] = useState(true);
  const [currentStandardData, setStandardData] = useState<any>(null);
  const [currentWeatherData, setWeatherData] = useState<any>(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        let lat = 29.76328,
          long = -95.36327;

        if (!navigator.geolocation) {
          throw new Error("Geobrowser is not supported by the user.");
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            lat = position.coords.latitude;
            long = position.coords.longitude;
          },
          () => {
            console.warn("No position avaliable.");
          }
        );

        let response = await fetch(
            `https://api.weather.gov/points/${lat},${long}`
          ),
          json: any = null;

        if (!response.ok) {
          throw new Error("HTTP Fetch Error - " + response.status);
        }
        json = await response.json();
        setStandardData(json);

        response = await fetch(json.properties.forecastHourly);
        if (!response.ok) {
          throw new Error("HTTP Fetch Error - " + response.status);
        }

        setWeatherData(await response.json());
      } catch (e) {
        console.error("Data failed to be fetched from API. " + e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [refresh]);

  if (loading) {
    return (
      <div className="col d-flex flex-column gap-2">
        <TimeContainer is12Hour={settings.clock === "clock12Hr"} />
        <div
          className="container standardComponent rounded-4"
          id="weatherContainer"
        >
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (
    currentWeatherData === null ||
    (currentWeatherData != null && Object.keys(currentWeatherData).length === 0)
  ) {
    return (
      <div className="col d-flex flex-column gap-2">
        <TimeContainer is12Hour={settings.clock === "clock12Hr"} />
        <div
          className="container standardComponent rounded-4"
          id="weatherContainer"
        >
          <p>Unable to load data.</p>
        </div>
      </div>
    );
  }

  const referenceValues: {
    currently: {
      temperature: any;
      degree: any;
      precipitation: any;
      humidity: any;
      windSpeed: any;
      forecast: any;
    };
    periods: { time: any; temperature: any }[];
  } = {
    currently: {
      temperature: currentWeatherData.properties.periods[0].temperature,
      degree: currentWeatherData.properties.periods[0].temperatureUnit,
      precipitation:
        currentWeatherData.properties.periods[0].probabilityOfPrecipitation
          .value,
      humidity: currentWeatherData.properties.periods[0].relativeHumidity.value,
      windSpeed: currentWeatherData.properties.periods[0].windSpeed,
      forecast: currentWeatherData.properties.periods[0].shortForecast,
    },
    periods: [],
  };

  for (let i = 0; i < 9; i++) {
    const period = currentWeatherData.properties.periods[i];
    referenceValues.periods.push({
      time: period.startTime,
      temperature:
        settings.degree === "degreeC"
          ? referenceValues.currently.degree === "F"
            ? Math.round(((period.temperature - 32) * 5) / 9)
            : period.temperature
          : referenceValues.currently.degree === "F"
          ? period.temperature
          : Math.round((period.temperature * 9) / 5 + 32),
    });
  }

  return (
    <div className="col d-flex flex-column gap-2">
      <TimeContainer is12Hour={settings.clock === "clock12Hr"} />
      <div
        className="container standardComponent rounded-4"
        id="weatherContainer"
      >
        <div className="container d-flex gap-2 flex-row align-items-center">
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
          <span className="ms-auto fs-3 mb-5">
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
        <TempChart
          periods={referenceValues.periods}
          is12Hour={settings.clock == "clock12Hr"}
        />
        <div className="container d-flex flex-row justify-content-between align-items-center p-2 mt-0">
          <span className="text">
            Source: National Weather Service (
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
            className="btn btn-primary d-flex align-items-center gap-2"
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
