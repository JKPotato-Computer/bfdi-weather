import { getCurrentTime } from "./TimeContainer.tsx";
import "../css/WeatherIcon.css";

interface WeatherIconProps {
  forecast: string;
}

function getIconName(forecast: string): string {
  const f = forecast.toLowerCase();
  let isEvening =
    getCurrentTime().getHours() >= 18 || getCurrentTime().getHours() < 6;

  if (f.includes("thunderstorm") || f.includes("t-storm"))
    return "thunderstorm";
  if (f.includes("snow") || f.includes("flurries") || f.includes("blizzard"))
    return "weather_snowy";
  if (f.includes("sleet") || f.includes("ice")) return "ac_unit";
  if (f.includes("rain") || f.includes("showers") || f.includes("drizzle"))
    return "rainy";
  if (f.includes("hail")) return "hail";
  if (f.includes("fog") || f.includes("mist") || f.includes("haze"))
    return "foggy";
  if (f.includes("cloudy") || f.includes("overcast")) return "cloud";
  if (
    f.includes("partly sunny") ||
    f.includes("partly cloudy") ||
    f.includes("mostly sunny")
  )
    return isEvening
      ? "partly_cloudy_night yellow"
      : "partly_cloudy_day yellow";
  if (f.includes("sunny") || f.includes("clear"))
    return isEvening ? "bedtime yellow" : "clear_day yellow";
  if (f.includes("wind")) return "air";
  return "help"; // fallback icon
}

function WeatherIcon({ forecast }: WeatherIconProps) {
  const iconName = getIconName(forecast);
  return (
    <span className={"weatherIcon material-symbols-rounded " + iconName}>
      {iconName.split(" ")[0]}
    </span>
  );
}

export default WeatherIcon;
