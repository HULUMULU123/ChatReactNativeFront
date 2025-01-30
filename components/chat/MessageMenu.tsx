import React from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

export default function MessageMenu({
  currentColors,
  translate,
  height,
  itemID,
  setReplyMessage,
}) {
  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: -80,
        backgroundColor: currentColors.myMessageColor,

        padding: 15,
        borderRadius: 20,
        height: height,

        transform: [{ translateX: translate }],
        overflow: "hidden",

        // Тень для iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,

        // Тень для Android
        elevation: 5,
        justifyContent: "center",
        zIndex: -100,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setReplyMessage(itemID);
        }}
      >
        <Text style={{ fontSize: 16 }}>Reply</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={{ fontSize: 16 }}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={{ fontSize: 16 }}>Delete</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
