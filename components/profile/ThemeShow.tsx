import { useTheme } from "@/context/ThemeProvider";
import { colorPalettes, themes } from "@/context/themes";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ThemeShow() {
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  const currentColors = colorPalettes[colorPalette];
  return (
    <LinearGradient
      style={{
        height: 270,
        width: "100%",

        borderRadius: 10,
        position: "relative",
      }}
      colors={currentColors.gradient}
    >
      <View
        style={{
          marginLeft: 10,
          marginTop: 20,
          width: "50%",
          padding: 10,
          backgroundColor: currentColors.messageColor,
          borderRadius: 10,
          borderBottomLeftRadius: 0,
        }}
      >
        <View
          style={{
            borderLeftWidth: 3,
            borderRadius: 4,
            padding: 3,
            borderColor: currentColors.nameColor,
            backgroundColor: currentColors.replyColor,
          }}
        >
          <Text style={{ color: currentColors.nameColor, fontWeight: "800" }}>
            Ivan Ivanov
          </Text>
          <Text
            style={{
              color: colorPalette == "darkNight" ? "#fff" : "#000",
            }}
          >
            Hey, did you watch the new episode of "The Last Kingdom"?
          </Text>
        </View>
        <Text
          style={{
            marginTop: 5,
            fontSize: 14,
            color: colorPalette == "darkNight" ? "#fff" : "#000",
          }}
        >
          Not yet! No spoilers, though. Is it good?
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          right: 10,
          top: 180,
          backgroundColor: currentColors.myMessageColor,
          padding: 10,
          width: "50%",
          borderRadius: 10,
          borderBottomRightRadius: 0,
        }}
      >
        <Text>So good! We need to talk about it after you watch it.</Text>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({});
