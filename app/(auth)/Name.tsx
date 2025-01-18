import {
  Button,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSession } from "@/app/ctx";
import useGlobal from "@/constants/global";
import { useEffect, useState } from "react";
import Search from "@/components/main/Search";
import UserList from "@/components/userSearch/UserList";
import { useTheme } from "@/context/ThemeProvider";
import { themes, colorPalettes } from "@/context/themes";
import { FontAwesome } from "@expo/vector-icons";
import api from "@/api/api";
export default function UsernameScreen() {
  const { signOut, session } = useSession();
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  const currentColors = colorPalettes[colorPalette];

  const json_session = JSON.parse(session || "");
  const [name, setName] = useState(json_session.user.first_name);

  // const socketConnect = useGlobal((state) => state.socketConnect);
  // const socketClose = useGlobal((state) => state.socketClose);

  const changeInfo = async () => {
    try {
      const res = await api({
        method: "POST",
        url: "http://10.0.2.2:8000/api/update/",
        data: {
          type: "name",
          info: name,
          username: json_session.user.username,
        },
      });
      signOut();
    } catch {
      console.log("something went wrong");
    }
  };
  return (
    <View
      style={{
        backgroundColor: currentTheme.background,
        minHeight: "100%",
        padding: 10,
      }}
    >
      <View
        style={{
          backgroundColor: currentTheme.blockBackground,
          borderRadius: 7,
        }}
      >
        <Text
          style={{
            color: currentTheme.system,
            fontSize: 15,
            padding: 7,
            fontWeight: "500",
          }}
        >
          Set username
        </Text>
        <View
          style={{
            padding: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            style={{ color: currentTheme.text, fontSize: 19 }}
            value={name}
            onChangeText={(text) => setName(text)}
            autoFocus
          />
          <TouchableWithoutFeedback onPress={changeInfo}>
            <FontAwesome name="check" color={currentTheme.system} size={20} />
          </TouchableWithoutFeedback>
        </View>
      </View>
      <Text style={{ color: currentTheme.infoText, marginTop: 10 }}>
        Here you can change your first name!
      </Text>
      <Text style={{ color: currentTheme.infoText, marginTop: 10 }}>
        You can use a-z.
      </Text>
    </View>
  );
}
