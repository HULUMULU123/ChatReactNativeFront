import {
  Button,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSession } from "@/app/ctx";
import useGlobal from "@/constants/global";
import { useEffect } from "react";
import Search from "@/components/main/Search";
import UserList from "@/components/userSearch/UserList";
import { useTheme } from "@/context/ThemeProvider";
import { themes, colorPalettes } from "@/context/themes";
import { BallIndicator } from "react-native-indicators";
export default function ModalScreen() {
  const { signOut, session } = useSession();
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  const currentColors = colorPalettes[colorPalette];

  const json_session = JSON.parse(session || "");

  // const socketConnect = useGlobal((state) => state.socketConnect);
  // const socketClose = useGlobal((state) => state.socketClose);

  const searchList = useGlobal((state) => state.searchList);

  const isLoading = useGlobal((state) => state.isLoaiding);
  console.log("fdsf", searchList, "srsdcs");
  // useEffect(() => {
  //   socketConnect(json_session.tokens);
  //   return () => {
  //     socketClose();
  //   };
  // }, []);
  const testpress = () => {
    console.log(theme, colorPalette);
    toggleTheme();
    // console.log(theme, colorPalette);
  };
  const themeStyles = StyleSheet.create({
    container: { backgroundColor: currentTheme.background },
  });
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          styles.container,
          themeStyles.container,
          { backgroundColor: currentTheme.background },
        ]}
      >
        {/* <Text style={styles.title}>All Chats</Text> */}
        <Search />
        {/* <Text>Welcome, {json_session.user.username.toUpperCase()}</Text> */}
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <View style={{ backgroundColor: "transparent" }}>
          {!isLoading ? (
            searchList?.length > 0 ? (
              <UserList users={searchList} />
            ) : (
              <Text
                style={{
                  color: currentTheme.text,
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                Sorry, there is no user with this name 😔
              </Text>
            )
          ) : (
            // searchList?.map((item) => (
            //   <Text key={item.username}>{item.username}</Text>
            // ))
            // <Text>Loading...</Text>
            <BallIndicator color={currentTheme.brand} size={50} />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "80%",
  },
});
