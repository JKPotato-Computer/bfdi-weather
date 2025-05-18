import Character from "./Character";

function Dialogue() {
  return (
    <div className="col">
      <span className="text">(not coded yet)</span>
      <div
        className="standardComponent rounded-4 p-3 pb-5 d-flex flex-column gap-2"
        id="charDialogue"
      >
        <span className="fs-1 h1 text">Leafy</span>
        <p className="fs-1 lh-sm text">
          "OMG, it's so nice and awesome out today! Let's all go out and enjoy
          it to the fullest!
        </p>
      </div>
      <Character character="Leafy" url="LeafyHappy.png" />
    </div>
  );
}

export default Dialogue;
