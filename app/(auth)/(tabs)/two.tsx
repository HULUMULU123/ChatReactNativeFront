import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useTheme } from "@/context/ThemeProvider";
import { themes } from "@/context/themes";
import { FontAwesome } from "@expo/vector-icons";
import useGlobal from "@/constants/global";
import { useEffect } from "react";
import { Link, router } from "expo-router";

import TimeAgo from "@/components/chat/TimeAgo";
import { BallIndicator } from "react-native-indicators";

export default function TabTwoScreen() {
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const getAllGroups = useGlobal((state) => state.getAllGroups);
  const allGroups = useGlobal((state) => state.allGroups);
  const currentTheme = themes[theme];

  useEffect(() => {
    getAllGroups();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme.background, width: "100%" },
      ]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={[
            styles.container,
            { backgroundColor: currentTheme.background, width: "100%" },
          ]}
        >
          <ScrollView style={styles.scrollChats}>
            {allGroups && allGroups?.data && allGroups?.data?.length > 0 ? (
              allGroups.data.map((chat) => (
                <TouchableOpacity
                  onPress={() => {
                    router.navigate(`(group)/${chat.name}`);
                    // handleChat(user1, chat.chat_name);
                  }}
                  key={chat.name}
                >
                  <View
                    key={chat.name}
                    style={[
                      styles.chatItem,
                      {
                        backgroundColor: currentTheme.blockBackground,

                        padding: 10,
                      },
                    ]}
                  >
                    <Image
                      source={{
                        uri: `http://10.0.2.2:8000${chat.thumbnail}`,
                      }}
                      style={{ width: 50, height: 50, borderRadius: 90 }}
                    />

                    <View
                      style={[
                        styles.msgInformation,
                        { backgroundColor: "transparent" },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "500",
                          textTransform: "capitalize",
                          color: currentTheme.text,
                        }}
                      >
                        {chat.name}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          backgroundColor: "transparent",
                        }}
                      >
                        {/* <Text style={{ color: currentTheme.text }}>
                          {chat.from}:{" "}
                        </Text>
                        <Text style={{ color: currentTheme.infoText }}>
                          {chat.content}
                        </Text> */}
                      </View>
                    </View>
                    {/* <TimeAgo
                      color={currentTheme.infoText}
                      timestamp={chat?.created_at}
                    /> */}
                  </View>
                  <View
                    style={{
                      width: "30%",
                      height: 1,
                      backgroundColor: currentTheme.background,
                    }}
                  ></View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={{ backgroundColor: "transparent", flex: 1 }}>
                <BallIndicator color={currentTheme.brand} size={50} />
              </View>
            )}
          </ScrollView>
        </View>
        {/* <View style={styles.container}>
      <Button
        title="Sign Out"
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      />
    </View> */}
      </TouchableWithoutFeedback>
      <Link
        style={{ position: "absolute", bottom: 10, right: 10 }}
        href="/Group"
      >
        <View
          style={{
            backgroundColor: currentTheme.blockBackground,
            width: 50,
            height: 50,
            borderRadius: 100,
            borderWidth: 2,
            borderColor: currentTheme.infoText,
            justifyContent: "center",
          }}
        >
          <FontAwesome
            name="edit"
            size={22}
            color={currentTheme.infoText}
            style={{ alignSelf: "center" }}
          />
        </View>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  scrollChats: {
    flex: 1,
    width: "100%",
  },
  chatItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",

    marginLeft: 0,
    marginRight: 10,

    paddingBottom: 10,
  },
  msgInformation: {
    flexDirection: "column",
    width: 100,
    marginLeft: 20,
  },
});
