import SliderInfo from "@/components/first_page/SliderInfo";
import { useTheme } from "@/context/ThemeProvider";
import { themes } from "@/context/themes";
import { Link } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";

export default function first_page() {
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: currentTheme.background,
      }}
    >
      <SliderInfo />
    </View>
  );
}
