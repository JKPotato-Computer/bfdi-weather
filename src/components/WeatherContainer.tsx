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
  const [unsupportedLocation, setUnsupportedLocation] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        let lat, long;
        setUnsupportedLocation(false);

        if (settings.useCurrentLocation) {
          if (!navigator.geolocation) {
            throw new Error("Geobrowser is not supported by the user.");
          }
          // Get current location (async)
          const position: GeolocationPosition = await new Promise(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            }
          );
          lat = position.coords.latitude;
          long = position.coords.longitude;

          // Reverse geocode to check country and state/territory
          const reverseUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json&zoom=5&addressdetails=1`;
          const reverseResp = await fetch(reverseUrl, {
            headers: {
              "Accept-Language": "en",
              "User-Agent": "bfdi-weather-app",
            },
          });
          const reverseJson = await reverseResp.json();
          const countryCode = reverseJson.address?.country_code?.toUpperCase();
          const stateCode =
            reverseJson.address?.state || reverseJson.address?.region || "";
          // List of supported US states/territories (same as in Settings)
          const SUPPORTED = [
            "AL",
            "AK",
            "AZ",
            "AR",
            "CA",
            "CO",
            "CT",
            "DE",
            "FL",
            "GA",
            "HI",
            "ID",
            "IL",
            "IN",
            "IA",
            "KS",
            "KY",
            "LA",
            "ME",
            "MD",
            "MA",
            "MI",
            "MN",
            "MS",
            "MO",
            "MT",
            "NE",
            "NV",
            "NH",
            "NJ",
            "NM",
            "NY",
            "NC",
            "ND",
            "OH",
            "OK",
            "OR",
            "PA",
            "RI",
            "SC",
            "SD",
            "TN",
            "TX",
            "UT",
            "VT",
            "VA",
            "WA",
            "WV",
            "WI",
            "WY",
            "AS",
            "DC",
            "FM",
            "GU",
            "MH",
            "MP",
            "PR",
            "PW",
            "VI",
          ];
          // Try to get state/territory abbreviation from address
          let stateAbbr = reverseJson.address?.state_code?.toUpperCase();
          if (!stateAbbr && reverseJson.address?.state) {
            // fallback: try to match full state name to abbreviation
            const stateMap: Record<string, string> = {
              Alabama: "AL",
              Alaska: "AK",
              Arizona: "AZ",
              Arkansas: "AR",
              California: "CA",
              Colorado: "CO",
              Connecticut: "CT",
              Delaware: "DE",
              Florida: "FL",
              Georgia: "GA",
              Hawaii: "HI",
              Idaho: "ID",
              Illinois: "IL",
              Indiana: "IN",
              Iowa: "IA",
              Kansas: "KS",
              Kentucky: "KY",
              Louisiana: "LA",
              Maine: "ME",
              Maryland: "MD",
              Massachusetts: "MA",
              Michigan: "MI",
              Minnesota: "MN",
              Mississippi: "MS",
              Missouri: "MO",
              Montana: "MT",
              Nebraska: "NE",
              Nevada: "NV",
              "New Hampshire": "NH",
              "New Jersey": "NJ",
              "New Mexico": "NM",
              "New York": "NY",
              "North Carolina": "NC",
              "North Dakota": "ND",
              Ohio: "OH",
              Oklahoma: "OK",
              Oregon: "OR",
              Pennsylvania: "PA",
              "Rhode Island": "RI",
              "South Carolina": "SC",
              "South Dakota": "SD",
              Tennessee: "TN",
              Texas: "TX",
              Utah: "UT",
              Vermont: "VT",
              Virginia: "VA",
              Washington: "WA",
              "West Virginia": "WV",
              Wisconsin: "WI",
              Wyoming: "WY",
              "District of Columbia": "DC",
              "American Samoa": "AS",
              Guam: "GU",
              "Northern Mariana Islands": "MP",
              "Puerto Rico": "PR",
              "U.S. Virgin Islands": "VI",
              Palau: "PW",
              "Marshall Islands": "MH",
              "Federated States of Micronesia": "FM",
            };
            stateAbbr = stateMap[reverseJson.address.state] || "";
          }
          if (
            countryCode == "US" ||
            (stateAbbr && !SUPPORTED.includes(stateAbbr))
          ) {
            setUnsupportedLocation(true);
            setLoading(false);
            return;
          }
        } else {
          // Use city/state or default to Washington, DC
          let city = settings.city?.trim();
          let state = settings.state?.trim();
          if (!city || !state) {
            city = "Washington";
            state = "DC";
          }
          // Fetch lat/long from Nominatim
          const nominatimUrl = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
            city
          )}&state=${encodeURIComponent(
            state
          )}&country=USA&format=json&limit=1`;
          const geoResp = await fetch(nominatimUrl, {
            headers: {
              "Accept-Language": "en",
              "User-Agent": "bfdi-weather-app",
            },
          });
          const geoJson = await geoResp.json();
          if (!geoJson || geoJson.length === 0) {
            throw new Error("Could not find location for provided city/state.");
          }
          lat = geoJson[0].lat;
          long = geoJson[0].lon;
        }

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
      <div className="col d-flex flex-column gap-2">
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
                  areas
                </li>
                <li>
                  please select a US city and state in the settings to view
                  weather information
                </li>
              </ul>
            </>
          )}
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
        className="container standardComponent rounded-4 d-flex flex-column justify-content-between"
        id="weatherContainer"
        style={{ minHeight: "420px", height: "100%" }}
      >
        <div>
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
          <TempChart
            periods={referenceValues.periods}
            is12Hour={settings.clock == "clock12Hr"}
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
