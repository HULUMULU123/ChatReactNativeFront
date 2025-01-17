import { useTheme } from "@/context/ThemeProvider";
import { colorPalettes, themes } from "@/context/themes";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableWithoutFeedback, View } from "react-native";

export default function ChangeProfileInfo() {
  const [showUsernameameFrom, setShowUsernameFrom] = useState(false);
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  const currentColors = colorPalettes[colorPalette];
  const changeInfo = () => {
    setShowUsernameFrom(false);
  };
  return (
    <View>
      <Text
        style={{
          color: currentTheme.system,
          fontSize: 17,
          fontWeight: "500",
          padding: 5,
        }}
      >
        Profile Settings
      </Text>
      {/* <TouchableWithoutFeedback onPress={() => setShowUsernameFrom(true)}>
        <View>
          {showUsernameameFrom ? (
            <View>
              <TextInput value="text" />
              <TouchableWithoutFeedback onPress={changeInfo}>
                <FontAwesome name="check" color="#000" size={10} />
              </TouchableWithoutFeedback>
            </View>
          ) : (
            <Text>text</Text>
          )}
        </View>
      </TouchableWithoutFeedback> */}
      <Link
        style={{
          padding: 10,
          //   borderBottomWidth: 1,
          //   width: "80%",
          //   borderColor: currentTheme.system,
          //   borderRadius: 7,
        }}
        href="/Username"
      >
        <Text
          style={{
            color: currentTheme.system,
            fontSize: 15,
            fontWeight: "400",
          }}
        >
          Change Username
        </Text>
      </Link>

      <View
        style={{
          marginVertical: 10,
          height: 0.8,
          width: "100%",
          backgroundColor: currentTheme.infoText,
        }}
      />
      <Link
        style={{
          padding: 10,
          //   borderBottomWidth: 1,
          //   width: "80%",
          //   borderColor: currentTheme.system,
          //   borderRadius: 7,
        }}
        href="/Name"
      >
        <Text
          style={{
            color: currentTheme.system,
            fontSize: 15,
            fontWeight: "400",
          }}
        >
          Change First Name
        </Text>
      </Link>
      <View
        style={{
          marginVertical: 10,
          height: 0.8,
          width: "100%",
          backgroundColor: currentTheme.infoText,
        }}
      />
      <Link
        style={{
          padding: 10,
          //   borderBottomWidth: 1,
          //   width: "80%",
          //   borderColor: currentTheme.system,
          //   borderRadius: 7,
        }}
        href="/Surname"
      >
        <Text
          style={{
            color: currentTheme.system,
            fontSize: 15,
            fontWeight: "400",
          }}
        >
          Change Last Name
        </Text>
      </Link>
    </View>
  );
}
