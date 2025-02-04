import React, { useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import MessageTime from "./MessageTime";
import Reactions from "./Reactions";
import AttachedImage from "./AttachedImage";
import MessageMenu from "./MessageMenu";
import { useTheme } from "@/context/ThemeProvider";

export default function MyMessageGroup({
  styles,
  item,
  currentTheme,
  currentColors,

  username,
}) {
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();

  // Инвертируем состояние

  return (
    <>
      <View style={[styles.myMSG]}>
        {}
        {item.content ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.msgTextMe}>{item.content}</Text>
            <MessageTime
              time={item.created_at}
              backgroundColor={"transparent"}
              textColor={currentTheme.infoText}
              position={""}
            />
          </View>
        ) : (
          <MessageTime
            time={item.created_at}
            backgroundColor={currentColors.nameColor}
            textColor={"#fff"}
            position={"absolute"}
          />
        )}
      </View>
    </>
  );
}
