import React, { createContext, useState, useContext } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  colorPalette:
    | "pinkPurple"
    | "blueGreen"
    | "sunset"
    | "tealPurple"
    | "sand"
    | "warmCoral"
    | "deepPurple"
    | "cosmos"
    | "darkNight"
    | "vibrantOrange";
  toggleTheme: () => void;
  changeColorPalette: (
    palette:
      | "pinkPurple"
      | "blueGreen"
      | "sunset"
      | "tealPurple"
      | "sand"
      | "warmCoral"
      | "deepPurple"
      | "cosmos"
      | "darkNight"
      | "vibrantOrange"
  ) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [colorPalette, setColorPalette] = useState<
    | "pinkPurple"
    | "blueGreen"
    | "sunset"
    | "tealPurple"
    | "sand"
    | "warmCoral"
    | "deepPurple"
    | "cosmos"
    | "darkNight"
    | "vibrantOrange"
  >("sand");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const changeColorPalette = (
    palette:
      | "pinkPurple"
      | "blueGreen"
      | "sunset"
      | "tealPurple"
      | "sand"
      | "warmCoral"
      | "deepPurple"
      | "cosmos"
      | "darkNight"
      | "vibrantOrange"
  ) => {
    setColorPalette(palette);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, colorPalette, toggleTheme, changeColorPalette }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
