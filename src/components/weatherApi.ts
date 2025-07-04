import type { SettingsData } from "./Settings";

interface WeatherData {
  currently: {
    temperature: any;
    degree: any;
    precipitation: any;
    humidity: any;
    windSpeed: any;
    forecast: any;
  };
  periods: { time: any; temperature: any; humidity: any; precipitation: any }[];
}

const SUPPORTED_STATES: Record<string, string> = {
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

let lastUpdatedTime = 0;

export function readWeatherData(
  weatherData: { properties: { periods: any[] } },
  settings: SettingsData
) {
  const referenceValues: WeatherData = {
    currently: {
      temperature: weatherData.properties.periods[0].temperature,
      degree: weatherData.properties.periods[0].temperatureUnit,
      precipitation:
        weatherData.properties.periods[0].probabilityOfPrecipitation.value,
      humidity: weatherData.properties.periods[0].relativeHumidity.value,
      windSpeed: weatherData.properties.periods[0].windSpeed,
      forecast: weatherData.properties.periods[0].shortForecast,
    },
    periods: [],
  };

  for (let i = 0; i < 9; i++) {
    const period = weatherData.properties.periods[i];
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
      humidity: period.relativeHumidity.value,
      precipitation: period.probabilityOfPrecipitation.value,
    });
  }

  return referenceValues;
}

const verifyLocation = async (lat: number, long: number) => {
  const reverseUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json&zoom=5&addressdetails=1`;
  const reverseResp = await fetch(reverseUrl, {
    headers: { "Accept-Language": "en", "User-Agent": "bfdi-weather-app" },
  });
  const reverseJson = await reverseResp.json();

  const countryCode = reverseJson.address?.country_code?.toUpperCase();
  let stateAbbr = reverseJson.address?.state_code?.toUpperCase();

  if (!stateAbbr && reverseJson.address?.state) {
    stateAbbr = SUPPORTED_STATES[reverseJson.address.state] || "";
  }

  return (
    countryCode !== "US" ||
    (stateAbbr && Object.values(SUPPORTED_STATES).includes(stateAbbr))
  );
};

const getLatLongFromCurrentLocation = async () => {
  if (!navigator.geolocation) {
    throw new Error("GeobrowserUnsupported");
  }

  const position: GeolocationPosition = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

  let lat = position.coords.latitude;
  let long = position.coords.longitude;

  if (!(await verifyLocation(lat, long))) {
    throw new Error("UnsupportedLocation");
  } else {
    return [lat, long];
  }
};

const getLatLongFromGivenLocation = async (city: string, state: string) => {
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
    city
  )}&state=${encodeURIComponent(state)}&country=USA&format=json&limit=1`;

  const geoResp = await fetch(nominatimUrl, {
    headers: { "Accept-Language": "en", "User-Agent": "bfdi-weather-app" },
  });

  const geoJson = await geoResp.json();
  if (!geoJson || geoJson.length === 0) {
    throw new Error("UnsupportedLocation");
  }

  return [geoJson[0].lat, geoJson[0].lon];
};

const fetchAPI = async (url: string) => {
  let response = await fetch(url);
  if (!response.ok) {
    throw new Error("HTTPFetchError - " + response.status);
  }
  return await response.json();
};

export function getLastUpdatedTime() {
  return lastUpdatedTime;
}

export async function fetchWeatherData(settings: SettingsData) {
  let currentStandardData = null;
  let currentWeatherData = null;
  lastUpdatedTime = new Date().getTime();

  try {
    let lat: string | number, long: string | number;
    if (settings.useCurrentLocation) {
      [lat, long] = await getLatLongFromCurrentLocation();
    } else {
      [lat, long] = await getLatLongFromGivenLocation(
        settings.city?.trim() || "Washington",
        settings.state?.trim() || "DC"
      );
    }

    currentStandardData = await fetchAPI(
      `https://api.weather.gov/points/${lat},${long}`
    );

    currentWeatherData = await fetchAPI(
      currentStandardData.properties.forecastHourly
    );
  } catch (errorReason) {
    return [currentStandardData, currentWeatherData, errorReason];
  }
  return [currentStandardData, currentWeatherData, "UnsupportedLocation"];
}

export type { WeatherData };
