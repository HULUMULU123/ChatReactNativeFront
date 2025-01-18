import useGlobal from "@/constants/global";
import { useTheme } from "@/context/ThemeProvider";
import { colorPalettes, themes } from "@/context/themes";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomHeader({ route }) {
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  const currentColors = colorPalettes[colorPalette];
  const navigation = useNavigation();

  const getAvatar = useGlobal((state) => state.getAvatar);
  const avatarURI = useGlobal((state) => state.avatarUri);
  const { username } = route.params;
  console.log(route, "eoutic");
  useEffect(() => {
    getAvatar(username);
  }, [route]);
  const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 15,
      backgroundColor: currentColors.nameColor,
      borderBottomWidth: 1,
      borderColor: "transparent",
    },
    backButton: {
      fontSize: 24,
      marginRight: 10,
      color: "#fff",
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    username: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
    },
  });
  return (
    <SafeAreaView style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>←</Text>
      </TouchableOpacity>
      <Image
        source={{
          uri: `http://10.0.2.2:8000${avatarURI.thumbnail}`,
        }}
        style={styles.avatar}
      />
      <Text style={styles.username}>{username}</Text>
    </SafeAreaView>
  );
}
