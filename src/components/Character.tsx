import React from "react";

interface CharacterProps {
  image?: string;
  scale?: number;
  classProperties?: string;
  styles?: React.CSSProperties & { [key: string]: any };
}

function Character({ image, scale, classProperties, styles }: CharacterProps) {
  if (!image) {
    return;
  }

  styles = styles && Object.keys(styles).length === 0 ? {} : { ...styles };
  styles["--scaleValue"] = scale;

  return (
    <img
      src={"characterEmotions\\" + image}
      className={"" + classProperties}
      style={styles}
      id="character"
    />
  );
}

export default Character;
