const characterDialogues: Record<string, Record<string, string>> = {
  Firey: {
    sunny: "It's so hot! I love it!",
    cloudy: "Where did the sun go?",
    raining: "Ack! Water! Stay away from me!",
    snowy: "Snow? That's just frozen water. Yikes!",
    windy: "Windy, but at least it's not raining.",
    foggy: "I can't see the sun through this fog...",
    other: "Weather's weird today.",
  },
  Leafy: {
    sunny: "Sunshine helps me grow!",
    cloudy: "Clouds are nice sometimes.",
    raining: "Rain is great for plants like me!",
    snowy: "Snow is cold, but pretty!",
    windy: "Wind makes my leaves flutter!",
    foggy: "Fog makes everything mysterious.",
    other: "Interesting weather we're having!",
  },
  Bubble: {
    sunny: "Yay, it's sunny! Bubbly day!",
    cloudy: "Clouds are okay, I guess.",
    raining: "Oh no, rain might pop me!",
    snowy: "Snow is fun, but I'm careful!",
    windy: "Windy days make me float!",
    foggy: "Fog makes it hard to see bubbles.",
    other: "Bubble-tastic weather!",
  },
  Woody: {
    sunny: "S-sunny days are nice... I guess.",
    cloudy: "Clouds make me nervous.",
    raining: "Rain is scary!",
    snowy: "Snow is cold... brrr.",
    windy: "Wind makes me anxious.",
    foggy: "I can't see! Yikes!",
    other: "I hope the weather gets better.",
  },
  Pin: {
    sunny: "Perfect weather for an experiment.",
    cloudy: "Clouds are interesting to study.",
    raining: "Rain can be measured precisely.",
    snowy: "Snowflakes are fascinating!",
    windy: "Wind speed is measurable.",
    foggy: "Fog is just tiny water droplets.",
    other: "Weather data is always useful.",
  },
  Eraser: {
    sunny: "Sun's out! Let's play!",
    cloudy: "Cloudy, but still fun.",
    raining: "Rain? Let's erase those clouds!",
    snowy: "Snowball fight, anyone?",
    windy: "Windy! Hold onto your hats!",
    foggy: "Foggy, but I can still see fun!",
    other: "Weather can't stop me!",
  },
  Blocky: {
    sunny: "Sunny days are perfect for pranks!",
    cloudy: "Cloudy? Still good for mischief.",
    raining: "Rainy? Time for indoor pranks!",
    snowy: "Snow pranks are the best!",
    windy: "Windy? Let's fly some stuff!",
    foggy: "Fog is great for sneaky pranks.",
    other: "Weather's wild, just like my pranks!",
  },
  Match: {
    sunny: "Like, it's so bright! Love it!",
    cloudy: "Clouds are, like, okay.",
    raining: "Rain ruins my hair, ugh.",
    snowy: "Snow is, like, cute!",
    windy: "Wind messes up my style.",
    foggy: "Fog is, like, mysterious.",
    other: "Whatever, it's just weather.",
  },
  Pencil: {
    sunny: "Sunny days are the best!",
    cloudy: "Cloudy, but still cool.",
    raining: "Rainy days are for drawing inside.",
    snowy: "Snow is so fun to draw!",
    windy: "Windy! Hold onto your pencils!",
    foggy: "Fog makes everything look dreamy.",
    other: "Weather inspires my art.",
  },
  Snowball: {
    sunny: "Too warm! I might melt!",
    cloudy: "Clouds help me stay cool.",
    raining: "Rain? I'm getting smaller!",
    snowy: "Snow! My favorite!",
    windy: "Windy, but I'm solid.",
    foggy: "Fog is just more water.",
    other: "Weather's not bad for a snowball.",
  },
  TennisBall: {
    sunny: "Great day for tennis!",
    cloudy: "Clouds won't stop my serve.",
    raining: "Rain delays the match.",
    snowy: "Snow tennis? That's new.",
    windy: "Windy serves are tricky.",
    foggy: "Foggy courts are hard to play on.",
    other: "Game, set, weather!",
  },
  GolfBall: {
    sunny: "Perfect for golf science.",
    cloudy: "Clouds don't affect my calculations.",
    raining: "Rain affects golf ball trajectory.",
    snowy: "Snow makes golf challenging.",
    windy: "Wind is a variable to consider.",
    foggy: "Fog reduces visibility.",
    other: "Weather is just another factor.",
  },
  Rocky: {
    sunny: "...",
    cloudy: "...",
    raining: "...",
    snowy: "...",
    windy: "...",
    foggy: "...",
    other: "...",
  },
  Spongy: {
    sunny: "Soakin' up the sun!",
    cloudy: "Cloudy, but still squishy.",
    raining: "Rain? I'm getting bigger!",
    snowy: "Snow is cold, but fun!",
    windy: "Wind dries me out.",
    foggy: "Fog is just more moisture.",
    other: "Spongy weather!",
  },
  Coiny: {
    sunny: "Shiny weather for a shiny coin!",
    cloudy: "Clouds can't dull my shine.",
    raining: "Rain makes me slippery.",
    snowy: "Snow is cold on metal.",
    windy: "Windy, but I'm heavy.",
    foggy: "Fog makes me hard to find.",
    other: "Heads or tails on the weather?",
  },
  Needle: {
    sunny: "Sharp weather today.",
    cloudy: "Clouds are fine.",
    raining: "Rain makes me rust.",
    snowy: "Snow is cold, but manageable.",
    windy: "Windy, but I stand tall.",
    foggy: "Fog is no match for me.",
    other: "Weather's just weather.",
  },
  Teardrop: {
    sunny: "😊",
    cloudy: "😐",
    raining: "😄",
    snowy: "😯",
    windy: "😶",
    foggy: "😶",
    other: "🙂",
  },
  IceCube: {
    sunny: "I'm melting! Help!",
    cloudy: "Clouds help me stay cool.",
    raining: "Rain is just more water.",
    snowy: "Snow! I feel at home.",
    windy: "Wind chills me.",
    foggy: "Fog is refreshing.",
    other: "Cool weather, huh?",
  },
  Book: {
    sunny: "Great weather for reading outside.",
    cloudy: "Cloudy days are cozy for books.",
    raining: "Rainy days are perfect for reading.",
    snowy: "Snow and books? Yes please.",
    windy: "Windy, but I can still read.",
    foggy: "Fog makes reading mysterious.",
    other: "Any weather is good for books.",
  },
  Lollipop: {
    sunny: "Sweet sunshine!",
    cloudy: "Clouds are okay.",
    raining: "Rain melts my sugar!",
    snowy: "Snow is chilly for candy.",
    windy: "Windy, but I'm wrapped up.",
    foggy: "Fog is sticky.",
    other: "Sweet weather!",
  },
  // Add more BFDI characters as needed...
};

export function getRandomCharacter() {
    return Object.keys(characterDialogues)[
        Math.floor(Math.random() * Object.keys(characterDialogues).length)
    ];
}

export function getResponse(character: string, condition: string) {
    console.log(character, forecastToDialogueCategory(condition));
    return characterDialogues[character][forecastToDialogueCategory(condition)];
}

export { characterDialogues };

/**
 * Maps a forecast string to a characterDialogues weather category.
 */
function forecastToDialogueCategory(forecast: string): string {
  const f = forecast.toLowerCase();
  if (f.includes("thunderstorm") || f.includes("t-storm"))
    return "raining";
  if (f.includes("snow") || f.includes("flurries") || f.includes("blizzard"))
    return "snowy";
  if (f.includes("sleet") || f.includes("ice"))
    return "snowy";
  if (f.includes("rain") || f.includes("showers") || f.includes("drizzle"))
    return "raining";
  if (f.includes("hail"))
    return "raining";
  if (f.includes("fog") || f.includes("mist") || f.includes("haze"))
    return "foggy";
  if (f.includes("cloudy") || f.includes("overcast"))
    return "cloudy";
  if (
    f.includes("partly sunny") ||
    f.includes("partly cloudy") ||
    f.includes("mostly sunny")
  )
    return "sunny";
  if (f.includes("sunny") || f.includes("clear"))
    return "sunny";
  if (f.includes("wind"))
    return "windy";
  return "other";
}