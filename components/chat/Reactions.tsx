import React from "react";
import { Animated, FlatList, Text, TouchableOpacity, View } from "react-native";

export default function Reactions({
  currentColors,
  width,
  translate,
  setReactions,
  username,
  emoji,

  side = "",
}) {
  const items = ["❤️", "👍", "👎", "💪", "😭"];
  console.log(username, emoji);
  const Reaction = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        setReactions(item);
      }}
    >
      <Text style={{ fontSize: 18 }}>{item}</Text>
    </TouchableOpacity>
  );
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: -60,
          right: 10,
          backgroundColor: currentColors.myMessageColor,

          padding: 10,
          borderRadius: 20,
          width: width,
          overflow: "hidden",
          transform: [{ translateY: translate }],
          // Тень для iOS
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 6,

          // Тень для Android
          elevation: 5,
        },
        side === "left" && { right: 0, left: 10 },
      ]}
    >
      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={Reaction}
      />
    </Animated.View>
  );
}
