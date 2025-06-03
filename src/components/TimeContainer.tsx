import { useEffect, useState } from "react";

interface TimeContainerProps {
  is12Hour: boolean;
}

function TimeContainer({ is12Hour }: TimeContainerProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const body = document.body;
    const hours = currentTime.getHours();
    body.style.background =
      hours >= 18 || hours < 6 ? "var(--nighttime)" : "var(--daytime)";
    body.className = hours >= 18 || hours < 6 ? "dark" : "light";
    const htmlElement = document.querySelector("html");
    if (htmlElement) {
      htmlElement.style.background =
        hours >= 18 || hours < 6 ? "var(--nightcolor)" : "var(--daycolor)";
    }

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="container standardComponent rounded-4 d-flex justify-content-between px-3"
      id="timeContainer"
    >
      <span className="fs-4 text" id="date">
        {currentTime
          .toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
          .replace(/^((?:[^,]*,){1})([^,]*),(.*)$/g, "$1$2$3")}
      </span>
      <span className="fs-4 text" id="time">
        {currentTime.toLocaleTimeString("en-us", {
          hour12: is12Hour,
        })}
      </span>
    </div>
  );
}

export default TimeContainer;
