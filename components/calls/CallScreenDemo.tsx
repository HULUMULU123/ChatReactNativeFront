import useGlobal from "@/constants/global";
import { useTheme } from "@/context/ThemeProvider";
import { themes } from "@/context/themes";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function CallScreenDemo() {
  const allChats = useGlobal((state) => state.allChats);
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  useEffect(() => {
    allChats?.data?.map((item) => {
      console.log(item.chat_name);
    });
  }, [allChats]);
  return (
    <View
      style={{
        backgroundColor: currentTheme.background,
        flex: 1,
        width: "100%",
        gap: 4,
      }}
    >
      {allChats?.data.map((item) => (
        <View
          style={{
            backgroundColor: currentTheme.blockBackground,
            paddingVertical: 10,
            paddingHorizontal: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          key={item.chat_name}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              source={{
                uri: `http://10.0.2.2:8000${item.avatar}`,
              }}
              style={{ width: 50, height: 50, borderRadius: 90 }}
            />
            <Text style={{ fontSize: 15, fontWeight: "500" }}>
              {item.chat_name}
            </Text>
          </View>
          <FontAwesome name="phone" size={25} color={currentTheme.brand} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    marginVertical: 5,
    height: 5,
    width: "100%",
    backgroundColor: "#000",
    color: "#000",
  },
});
