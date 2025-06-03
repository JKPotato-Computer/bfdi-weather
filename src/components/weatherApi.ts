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
    periods: { time: any; temperature: any; humidity: any; precipitation: any; }[];
}

export function readWeatherData(weatherData: { properties: { periods: any[]; }; }, settings: SettingsData) {
    const referenceValues: WeatherData = {
    currently: {
      temperature: weatherData.properties.periods[0].temperature,
      degree: weatherData.properties.periods[0].temperatureUnit,
      precipitation:
        weatherData.properties.periods[0].probabilityOfPrecipitation
          .value,
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
        temperature: settings.degree === "degreeC"
            ? referenceValues.currently.degree === "F"
                ? Math.round(((period.temperature - 32) * 5) / 9)
                : period.temperature
            : referenceValues.currently.degree === "F"
                ? period.temperature
                : Math.round((period.temperature * 9) / 5 + 32),
        humidity: period.relativeHumidity.value,
        precipitation: period.probabilityOfPrecipitation.value
    });
  }

  return referenceValues;
}

export async function fetchWeatherData(settings: SettingsData) {
  let unsupportedLocation = false;
  let currentStandardData = null;
  let currentWeatherData = null;

  try {
    let lat, long;

    if (settings.useCurrentLocation) {
      if (!navigator.geolocation) {
        throw new Error("Geobrowser is not supported by the user.");
      }
      const position: GeolocationPosition = await new Promise(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );
      lat = position.coords.latitude;
      long = position.coords.longitude;

      const reverseUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json&zoom=5&addressdetails=1`;
      const reverseResp = await fetch(reverseUrl, {
        headers: {"Accept-Language": "en", "User-Agent": "bfdi-weather-app",},
      });
      const reverseJson = await reverseResp.json();
      const countryCode = reverseJson.address?.country_code?.toUpperCase();
      const SUPPORTED = [
        "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","AS","DC","FM","GU","MH","MP","PR","PW","VI"
      ];
      let stateAbbr = reverseJson.address?.state_code?.toUpperCase();
      if (!stateAbbr && reverseJson.address?.state) {
        const stateMap: Record<string, string> = {
          Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO", Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY", "District of Columbia": "DC", "American Samoa": "AS", Guam: "GU", "Northern Mariana Islands": "MP", "Puerto Rico": "PR", "U.S. Virgin Islands": "VI", Palau: "PW", "Marshall Islands": "MH", "Federated States of Micronesia": "FM"
        };
        stateAbbr = stateMap[reverseJson.address.state] || "";
      }
      if (
        countryCode !== "US" ||
        (stateAbbr && !SUPPORTED.includes(stateAbbr))
      ) {
        unsupportedLocation = true;
        return { currentStandardData, currentWeatherData, unsupportedLocation };
      }
    } else {
      let city = settings.city?.trim();
      let state = settings.state?.trim();
      if (!city || !state) {
        city = "Washington";
        state = "DC";
      }
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
        city
      )}&state=${encodeURIComponent(
        state
      )}&country=USA&format=json&limit=1`;
      const geoResp = await fetch(nominatimUrl, {
        headers: {"Accept-Language": "en", "User-Agent": "bfdi-weather-app",},
      });
      const geoJson = await geoResp.json();
      if (!geoJson || geoJson.length === 0) {
        throw new Error("Could not find location for provided city/state.");
      }
      lat = geoJson[0].lat;
      long = geoJson[0].lon;
    }

    let response = await fetch(`https://api.weather.gov/points/${lat},${long}`), json: any = null;
    if (!response.ok) {
      throw new Error("HTTP Fetch Error - " + response.status);
    }

    json = await response.json();
    currentStandardData = json;

    response = await fetch(json.properties.forecastHourly);
    if (!response.ok) {
      throw new Error("HTTP Fetch Error - " + response.status);
    }

    currentWeatherData = await response.json();
  } catch (e) {
    console.error("Data failed to be fetched from API. " + e);
    return { currentStandardData, currentWeatherData, unsupportedLocation, e };
  }
  return { currentStandardData, currentWeatherData, unsupportedLocation };
}

export type { WeatherData };