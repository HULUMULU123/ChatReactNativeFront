import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import useGlobal from "@/constants/global";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/context/ThemeProvider";
import { colorPalettes, themes } from "@/context/themes";

interface filesProps {
  png: string;
  jpeg: string;
  doc: string;
  docx: string;
}
export default function AttachedFiles() {
  const fileUris = useGlobal((state) => state.fileUris);
  const deleteFileUri = useGlobal((state) => state.deleteFileUri);
  const { username } = useLocalSearchParams();
  let newFilesUris: any[] = [];
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  const currentColors = colorPalettes[colorPalette];

  useEffect(() => {
    requestPermissions();
  }, [fileUris]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access media library is required!");
    }
  };

  console.log(fileUris);
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: currentTheme.blockBackground,
      }}
    >
      {fileUris.length > 0 && (
        <View style={[styles.attachView, { alignItems: "center" }]}>
          {fileUris.map((index, item) => (
            <View
              key={index}
              style={[
                styles.attachedFile,
                { backgroundColor: currentColors.nameColor },
              ]}
            >
              <TouchableOpacity onPress={() => deleteFileUri(index, username)}>
                <Text
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -25,
                    color: "#fff",
                  }}
                >
                  X
                </Text>
              </TouchableOpacity>
              <Text style={styles.attachedText}>File</Text>
            </View>
          ))}
          {/* <Image
        source={{
          uri: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fexpo-router-study-05ccbf0a-8906-4b0b-959b-0da2042369c4/ImagePicker/41172649-cf9b-4554-8782-29680e67f5ce.jpeg",
        }}
        style={{ width: 300, height: 300 }}
      /> */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  attachView: {
    flexDirection: "row",
    height: 100,
    gap: 10,
    marginLeft: 20,
    alignSelf: "flex-start",
  },
  attachedFile: {
    height: 70,
    width: 70,
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
    paddingVertical: 10,

    position: "relative",
  },
  attachedText: {
    color: "#fff",
    fontWeight: "700",
  },
});
