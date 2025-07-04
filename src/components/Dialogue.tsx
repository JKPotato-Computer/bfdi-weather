import Character from "./Character";
import { getRandomCharacter, getResponse } from "./CharacterDialogues";
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
  const [randomResponse, setRandomResponse] = useState("");

  useEffect(() => {
    setCurrentCharacter(getRandomCharacter());
  }, [refreshDialogue]);

  useEffect(() => {
    setRandomResponse(getResponse(currentCharacter, forecast ?? ""));
  }, [currentCharacter, forecast]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (windowWidth <= 900) {
    return (
      <div className="col dialogueHolder">
        <div className="standardComponent rounded-4 p-3" id="charDialogue">
          <div className="row gap-3">
            <div className="col">
              <div className="d-flex flex-row justify-content-between mb-2">
                <span className="h1 text">{currentCharacter}</span>
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center gap-3"
                  onClick={onRefresh}
                >
                  <span className="material-symbols-rounded">refresh</span>{" "}
                  Refresh
                </button>
              </div>
              <p className="text lh-small">{randomResponse}</p>
            </div>
            <div className="col-4 d-flex justify-content-center align-items-center">
              <Character character="Leafy" url="LeafyHappy.png" />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="col dialogueHolder">
        <div
          className="standardComponent rounded-4 p-3 pb-5 d-flex flex-column gap-2"
          id="charDialogue"
        >
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
          <p className="text lh-small">{randomResponse}</p>
        </div>
        <Character character="Leafy" url="LeafyHappy.png" />
      </div>
    );
  }
}

export default Dialogue;
