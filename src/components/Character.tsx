interface CharacterProps {
  character: string;
  url: string;
}

function Character({ character, url }: CharacterProps) {
  return (
    <img src={url} data-character={character} className="" id="character" />
  );
}

export default Character;
