import Character from "./Character";
import { getRandomCharacter, getResponse } from "./CharacterDialogues";
import { useEffect, useState } from "react";

interface DialogueProps {
  forecast?: string;
  refreshCount?: number;
}

function Dialogue({ forecast, refreshCount }: DialogueProps) {
  const [currentCharacter, setCurrentCharacter] = useState(
    getRandomCharacter()
  );
  const [randomResponse, setRandomResponse] = useState("");

  useEffect(() => {
    setCurrentCharacter(getRandomCharacter());
  }, [refreshCount]);

  useEffect(() => {
    setRandomResponse(getResponse(currentCharacter, forecast ?? ""));
  }, [currentCharacter, forecast]);

  return (
    <div className="col dialogueHolder">
      <div
        className="standardComponent rounded-4 p-3 pb-5 d-flex flex-column gap-2"
        id="charDialogue"
      >
        <span className="h1 text">{currentCharacter}</span>
        <p className="text lh-small">{randomResponse}</p>
      </div>
      <Character character="Leafy" url="LeafyHappy.png" />
    </div>
  );
}

export default Dialogue;
