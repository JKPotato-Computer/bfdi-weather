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

export function getCurrentTime(): Date {
  return new Date();
}

export default TimeContainer;
