export interface Theme {
  background: string;
  blockBackground: string;
  menuBackGroundUp: string;
  menuBackGroundDown: string;
  text: string;
  infoText: string;
  system: string;
  brand: string;
  error: string;
  errorText: string;
}

export interface ColorPalette {
  gradient: [string, string];
  myMessageColor: string;
  messageColor: string;
  nameColor: string;
  replyColor: string;
  colorName: string;
}

export const themes: Record<"light" | "dark", Theme> = {
  light: {
    background: "#f1eff1",
    menuBackGroundUp: "#a259f7",
    menuBackGroundDown: "#fffeff",
    blockBackground: "#fffeff",
    text: "#242224",
    infoText: "#575656",
    system: "#8217ff",
    brand: "#7600ff",
    error: "#fccfcf",
    errorText: "#de5252",
  },
  dark: {
    background: "#010001",
    blockBackground: "#191819",
    menuBackGroundUp: "#260152",
    menuBackGroundDown: "#232523",
    text: "#fffeff",
    infoText: "#a8a7a7",
    system: "#9a44fc",
    brand: "#a651f5",
    error: "#de5252",
    errorText: "#fccfcf",
  },
};

export const colorPalettes: Record<
  | "pinkPurple"
  | "blueGreen"
  | "sunset"
  | "tealPurple"
  | "sand"
  | "warmCoral"
  | "deepPurple"
  | "cosmos"
  | "darkNight"
  | "vibrantOrange",
  ColorPalette
> = {
  pinkPurple: {
    gradient: ["#ff9a9e", "#fad0c4"],
    myMessageColor: "#fff",
    messageColor: "#fcd2e7",
    replyColor: "#ffebf5",
    nameColor: "#b56fa0",
    colorName: "🌹",
  },
  blueGreen: {
    gradient: ["#4facfe", "#00f2fe"],
    myMessageColor: "#fff",
    messageColor: "#80e6ff",
    nameColor: "#006494",
    replyColor: "#cdeef7",
    colorName: "⛄",
  },
  sunset: {
    gradient: ["#ff6a00", "#ee0979"],
    myMessageColor: "#fff",
    messageColor: "#ffa366",
    nameColor: "#d72638",
    replyColor: "#fabc93",
    colorName: "🐫",
  },
  tealPurple: {
    gradient: ["#6a11cb", "#2575fc"],
    myMessageColor: "#e0e8ff",
    messageColor: "#dab6fc",
    nameColor: "#3d42a4",
    replyColor: "#e8d2fc",
    colorName: "🌌",
  },
  sand: {
    gradient: ["#fdbb2d", "#22c1c3"],
    myMessageColor: "#fff",
    messageColor: "#d3f5f3",
    nameColor: "#f57f17",
    replyColor: "#f2fcfc",
    colorName: "🏝️",
  },
  warmCoral: {
    gradient: ["#ff7e5f", "#feb47b"],
    myMessageColor: "#fff",
    messageColor: "#ffd9c5",
    nameColor: "#ff5c3d",
    replyColor: "#f7e9e1",
    colorName: "🍹",
  },
  deepPurple: {
    gradient: ["#8e44ad", "#3498db"],
    myMessageColor: "#f3e5f5",
    messageColor: "#a5d8f3",
    nameColor: "#5b2c6f",
    replyColor: "#c6e5f5",
    colorName: "🛰️",
  },
  cosmos: {
    gradient: ["#2b5876", "#4e4376"],
    myMessageColor: "#dbe9f3",
    messageColor: "#c2c1dc",
    nameColor: "#374a59",
    replyColor: "#dddded",
    colorName: "🚀",
  },
  darkNight: {
    gradient: ["#232526", "#414345"],
    myMessageColor: "#d9d9d9",
    messageColor: "#757575",
    nameColor: "#c1c1c1",
    replyColor: "#4d4d4d",
    colorName: "🌚",
  },
  vibrantOrange: {
    gradient: ["#f85032", "#e73827"],
    myMessageColor: "#ffe4e1",
    messageColor: "#ffad99",
    nameColor: "#c62828",
    replyColor: "#fcd4ca",
    colorName: "🦧",
  },
};
