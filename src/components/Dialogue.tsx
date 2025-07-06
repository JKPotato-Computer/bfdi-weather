import Character from "./Character";
import {
  getRandomCharacter,
  getResponse,
  forecastToDialogueCategory,
  characterDialogues,
} from "./CharacterDialogues";
import { useEffect, useState } from "react";

interface DialogueProps {
  forecast?: string;
  refreshDialogue?: boolean;
  onRefresh?: () => void;
}

function Dialogue({ forecast, refreshDialogue, onRefresh }: DialogueProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [currentCharacter, setCurrentCharacter] = useState(
    getRandomCharacter()
  );
  const [randomResponse, setRandomResponse] = useState({
    dialogue: "",
    image: "",
    scale: 1,
    classProperties: "",
    styles: {} as React.CSSProperties,
  });
  const [refreshKey, setRefreshKey] = useState(0); // force re-render
  const [showImportance, setShowImportance] = useState(() => {
    try {
      return localStorage.getItem("hideImportanceBox") !== "true";
    } catch {
      return true;
    }
  });

  const handleCloseImportance = () => {
    setShowImportance(false);
    try {
      localStorage.setItem("hideImportanceBox", "true");
    } catch {
      // Ignore localStorage errors
    }
  };

  useEffect(() => {
    // Always pick a new character on refresh
    let newCharacter = getRandomCharacter();
    // Try to avoid repeating the same character
    if (newCharacter === currentCharacter) {
      const allChars = Object.keys(
        // @ts-ignore
        characterDialogues
      ).filter((c) => c !== currentCharacter);
      if (allChars.length > 0) {
        newCharacter = allChars[Math.floor(Math.random() * allChars.length)];
      }
    }
    setCurrentCharacter(newCharacter);
    setRefreshKey((k) => k + 1); // force re-render
  }, [refreshDialogue]);

  useEffect(() => {
    const response = getResponse(
      currentCharacter,
      forecast ?? "",
      new Date()
    ) || {
      dialogue: "No dialogue available.",
      image: "",
      scale: 1,
      classProperties: "",
      styles: {},
    };
    setRandomResponse(response);
  }, [currentCharacter, forecast, refreshKey]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Importance box JSX
  const importanceBox = showImportance ? (
    <div
      style={{
        position: "fixed", // changed from absolute to fixed
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "#d32f2f",
        color: "white",
        padding: "0.75rem 1.5rem",
        borderRadius: "0 0 1rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontWeight: 400,
        fontSize: "1.1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
      className="importance-box"
    >
      <div>
        <div className="row">
          <span style={{ fontWeight: 900 }}>
            hey!! looking for <i>more passionate</i> people to finish the
            project...
          </span>
        </div>
        <div className="row">
          <span>
            this was purely an attempt to recreate the twitter post, and spoiler
            alert: i did not come up with any of the dialogues lol, ty copilot
            <br />
            ur more than welcome to contribute on{" "}
            <a
              href="https://github.com/JKPotato-Computer/bfdi-weather"
              target="_blank"
              style={{ color: "white" }}
            >
              github
            </a>{" "}
            if you want - but otherwise, i'm done here. ty for checking it out!
            (you can view this again in settings)
          </span>
        </div>
      </div>
      <button
        onClick={handleCloseImportance}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "3rem",
          cursor: "pointer",
          marginLeft: "1rem",
          lineHeight: 1,
        }}
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  ) : null;

  if (
    randomResponse == undefined ||
    randomResponse == null ||
    forecastToDialogueCategory(forecast ?? "", new Date()) == "other"
  ) {
    return (
      <div className="col dialogueHolder">
        {importanceBox}
        <div className="standardComponent rounded-4 p-3" id="charDialogue">
          Waiting for a forecast...
        </div>
      </div>
    );
  }

  // Extract shared header and body
  const dialogueHeader = (
    <div className="d-flex flex-row justify-content-between mb-2">
      <span className="h1 text">{currentCharacter}</span>
      <button
        type="button"
        className="btn btn-primary d-flex align-items-center gap-3"
        onClick={onRefresh}
      >
        <span className="material-symbols-rounded">refresh</span> Refresh
      </button>
    </div>
  );
  const dialogueBody = (
    <p className="text lh-small">
      {randomResponse?.dialogue ?? "No dialogue available."}
    </p>
  );

  if (windowWidth <= 900) {
    return (
      <div className="col dialogueHolder">
        {importanceBox}
        <div className="standardComponent rounded-4 p-3" id="charDialogue">
          <div className="row gap-3">
            <div className="col">
              {dialogueHeader}
              {dialogueBody}
            </div>
            <div className="col-4 d-flex justify-content-center align-items-center">
              <Character
                image={randomResponse.image}
                classProperties={randomResponse.classProperties}
                scale={randomResponse.scale}
                styles={randomResponse.styles}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="col dialogueHolder">
        {importanceBox}
        <div
          className="standardComponent rounded-4 p-3 pb-5 d-flex flex-column gap-2"
          id="charDialogue"
        >
          {dialogueHeader}
          {dialogueBody}
        </div>
        <Character
          image={randomResponse.image}
          classProperties={randomResponse.classProperties}
          scale={randomResponse.scale}
          styles={randomResponse.styles}
        />
      </div>
    );
  }
}

export default Dialogue;
