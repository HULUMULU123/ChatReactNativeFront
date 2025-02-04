import React, { useRef, useState } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";
import MessageTime from "./MessageTime";
import AttachedImage from "./AttachedImage";
import MessageMenu from "./MessageMenu";
import Reactions from "./Reactions";
import { useTheme } from "@/context/ThemeProvider";

export default function FriendMessageGroup({
  styles,
  item,
  currentTheme,
  currentColors,
}) {
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "transparent",
        gap: 10,
        flexDirection: "row",
      }}
    >
      <Image
        source={{ uri: `http://10.0.2.2:8000${item.sender_thumbnail}` }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 90,
          zIndex: -1,
          marginLeft: 5,
        }}
      />
      <View style={styles.friendMSG}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            color: currentColors.nameColor,
          }}
        >
          {item.sender_username}
        </Text>
        {item.content ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              justifyContent: "space-between",
              backgroundColor: "transparent",
            }}
          >
            <Text style={styles.msgTextFriend}>{item.content}</Text>
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
    </View>
  );
}
