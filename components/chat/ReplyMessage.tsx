import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ReplyMessage({
  currentColors,
  currentTheme,
  item,
  setReplyMessage,
}) {
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: currentTheme.blockBackground,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View>
        <Text
          style={{
            color: currentColors.nameColor,
            fontWeight: "600",
            fontSize: 15,
          }}
        >
          Reply to {item.username}
        </Text>
        <Text style={{ color: currentTheme.infoText }}>{item.content}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          setReplyMessage("");
        }}
      >
        <Text style={{ color: currentTheme.infoText, fontSize: 16 }}>X</Text>
      </TouchableOpacity>
    </View>
  );
}
