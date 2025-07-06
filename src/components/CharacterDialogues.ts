import React from "react";

type CharacterDialogue = {
  dialogue: string;
  image: string;
  scale: number;
  classProperties: string;
  styles: React.CSSProperties;
};

const characterDialogues: Record<string, Record<string, CharacterDialogue>> = {
  Firey: {
    sunny: {
      dialogue: "It's so hot! I love it!",
      image: "FireyHappy.png",
      scale: 3,
      classProperties: "flip",
      styles: { right: "12.5%", bottom: "15%" },
    },
    night: {
      dialogue: "It's dark... but at least it's not raining fire!",
      image: "FireySit.png",
      scale: 2,
      classProperties: "flip",
      styles: { bottom: "20%", right: "15%" },
    },
    cloudy: {
      dialogue: "Where did the sun go?",
      image: "FireyBlank.png",
      scale: 2,
      classProperties: "",
      styles: { bottom: "20%", right: "5%" },
    },
    raining: {
      dialogue: '"Oh, no... RAIN! Oh, oh no oh no oh NOOO!!"',
      image: "FireyScared.png",
      scale: 2,
      classProperties: "flip",
      styles: { bottom: "15%", right: "10%" },
    },
    snowy: {
      dialogue: "Snow? That's just frozen water. Yikes!",
      image: "FireyScared.png",
      scale: 1,
      classProperties: "flip",
      styles: { bottom: "15%", right: "10%" },
    },
    windy: {
      dialogue: "Windy, but at least it's not raining.",
      image: "FireyBlank.png",
      scale: 1,
      classProperties: "",
      styles: { bottom: "20%", right: "5%" },
    },
    foggy: {
      dialogue: "I can't see the sun through this fog...",
      image: "FireyConfused.png",
      scale: 2.5,
      classProperties: "flip",
      styles: { right: "10%", bottom: "15%" },
    },
  },
  Leafy: {
    sunny: {
      dialogue:
        "\"OMG, it's so nice and awesome out today! Let's all go out and enjoy it to the fullest!\"",
      image: "LeafyHappy.png",
      scale: 2,
      classProperties: "",
      styles: { right: "0", bottom: "10%" },
    },
    night: {
      dialogue: "Nighttime is so peaceful! Let's stargaze!",
      image: "LeafySit.png",
      scale: 2,
      classProperties: "flip",
      styles: { bottom: "20%", right: "10%" },
    },
    cloudy: {
      dialogue: "Clouds are nice sometimes.",
      image: "LeafyBlank.png",
      scale: 1.5,
      classProperties: "",
      styles: { bottom: "10%" },
    },
    raining: {
      dialogue: "Rain is great for plants like me!",
      image: "LeafyChill.png",
      scale: 2.5,
      classProperties: "",
      styles: { right: "0" },
    },
    snowy: {
      dialogue: "Snow is cold, but pretty!",
      image: "LeafyAmazed.png",
      scale: 1,
      classProperties: "",
      styles: {},
    },
    windy: {
      dialogue: "Wind makes my leaves flutter!",
      image: "LeafyChill.png",
      scale: 2.5,
      classProperties: "",
      styles: { right: "0" },
    },
    foggy: {
      dialogue: "Fog makes everything mysterious.",
      image: "LeafyConfused.png",
      scale: 2.25,
      classProperties: "",
      styles: { bottom: "10%", right: "0" },
    },
  },
  Pencil: {
    sunny: {
      dialogue: "Sunny days are the best!",
      image: "PencilHappy.png",
      scale: 1,
      classProperties: "",
      styles: { bottom: "5%", rotate: "10deg" },
    },
    night: {
      dialogue: "Nighttime is great for drawing stars!",
      image: "PencilSleeping.png",
      scale: 3,
      classProperties: "flip",
      styles: { right: "17.5%", bottom: "20%" },
    },
    cloudy: {
      dialogue: "Cloudy, but still cool.",
      image: "PencilBlank.png",
      scale: 1,
      classProperties: "",
      styles: { bottom: "0", rotate: "10deg" },
    },
    raining: {
      dialogue: "Rainy days are for drawing inside.",
      image: "PencilHappy.png",
      scale: 1,
      classProperties: "",
      styles: { bottom: "5%", rotate: "10deg" },
    },
    snowy: {
      dialogue: '"Psh, yeah, like we need any more of SNOWBALL around."',
      image: "PencilLooking.png",
      scale: 1.75,
      classProperties: "",
      styles: { bottom: "7.5%", rotate: "-10deg" },
    },
    windy: {
      dialogue: "Windy! Hold onto your pencils!",
      image: "PencilScared.png",
      scale: 1,
      classProperties: "flip",
      styles: { bottom: "0", rotate: "10deg", right: "10%" },
    },
    foggy: {
      dialogue: "Fog makes everything look dreamy.",
      image: "PencilLooking.png",
      scale: 1.75,
      classProperties: "",
      styles: { bottom: "7.5%", rotate: "-10deg" },
    },
  },
};

export function getRandomCharacter() {
  return Object.keys(characterDialogues)[
    Math.floor(Math.random() * Object.keys(characterDialogues).length)
  ];
}

// Returns CharacterDialogue object for the character and weather
export function getResponse(
  character: string,
  condition: string,
  date?: Date
): CharacterDialogue {
  /*
  let list = [
    "sunny",
    "night",
    "cloudy",
    "raining",
    "snowy",
    "windy",
    "foggy",
    "other",
  ];
  return characterDialogues[char][list[ind]];
  */
  return characterDialogues[character][
    forecastToDialogueCategory(condition, date)
  ];
}

export { characterDialogues };

/**
 * Maps a forecast string to a characterDialogues weather category.
 * Optionally, pass a Date to determine if it's night.
 */
export function forecastToDialogueCategory(
  forecast: string,
  date?: Date
): string {
  const f = forecast.toLowerCase();
  // Night: only if clear/sunny and between 6pm (18) and 6am (6)
  if (date) {
    const hour = date.getHours();
    if (
      (f.includes("sunny") || f.includes("clear")) &&
      (hour >= 18 || hour < 6)
    ) {
      return "night";
    }
  }
  if (f.includes("thunderstorm") || f.includes("t-storm")) return "raining";
  if (f.includes("snow") || f.includes("flurries") || f.includes("blizzard"))
    return "snowy";
  if (f.includes("sleet") || f.includes("ice")) return "snowy";
  if (f.includes("rain") || f.includes("showers") || f.includes("drizzle"))
    return "raining";
  if (f.includes("hail")) return "raining";
  if (f.includes("fog") || f.includes("mist") || f.includes("haze"))
    return "foggy";
  if (f.includes("cloudy") || f.includes("overcast")) return "cloudy";
  if (
    f.includes("partly sunny") ||
    f.includes("partly cloudy") ||
    f.includes("mostly sunny")
  )
    return "sunny";
  if (f.includes("sunny") || f.includes("clear")) return "sunny";
  if (f.includes("wind")) return "windy";
  return "other";
}
