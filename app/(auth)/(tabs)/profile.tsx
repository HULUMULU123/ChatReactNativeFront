import { StatusBar } from "expo-status-bar";
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSession } from "@/app/ctx";
import { useTheme } from "@/context/ThemeProvider";
import { FontAwesome } from "@expo/vector-icons";
import { themes, colorPalettes } from "@/context/themes";
import ThemeChoice from "@/components/profile/ThemeChoice";
import ThemeShow from "@/components/profile/ThemeShow";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  runOnJS,
  withSequence,
  Easing,
} from "react-native-reanimated";
import ChangeProfileInfo from "@/components/profile/ChangeProfileInfo";
import ChangeProfileImage from "@/components/profile/ChangeProfileImage";
export default function ModalScreen() {
  const { signOut, session } = useSession();
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  const currentColors = colorPalettes[colorPalette];
  const bounceValue = useSharedValue(0); // Начальная позиция

  const json_session = JSON.parse(session || "");
  // const image_path = json_session.user.thumbnail
  //   ? json_session.user.thumbnail
  //   : "@/assets/images/icon.png";
  // console.log(image_path);
  const themeStyles = StyleSheet.create({
    container: {
      backgroundColor: currentTheme.background,
    },
    title: {
      color: currentTheme.text,
    },
    separator: {},
  });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceValue.value }],
  }));
  const addedToggleTheme = () => {
    bounceValue.value = withSequence(
      withTiming(-20, {
        duration: 300,
        easing: Easing.out(Easing.cubic), // Плавное ускорение и замедление
      }),
      withTiming(0, {
        duration: 500,
        easing: Easing.bounce, // Эффект пружины при возвращении
      })
    );

    // Меняем тему после окончания первого этапа анимации
    setTimeout(() => {
      runOnJS(toggleTheme)();
    }, 400);
  };
  return (
    <ScrollView style={[styles.container, themeStyles.container]}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          borderRadius: 10,
          paddingVertical: 20,

          alignItems: "center",
          backgroundColor: currentTheme.blockBackground,
          marginTop: 10,
          gap: 20,
          paddingHorizontal: 20,
          position: "relative",
        }}
      >
        <Image
          source={{ uri: `http://10.0.2.2:8000${json_session.user.thumbnail}` }}
          style={{
            width: 70,
            height: 70,
            borderRadius: 90,
            zIndex: -1,
          }}
        />
        <View style={{ backgroundColor: "transparent" }}>
          <View
            style={{ backgroundColor: "transparent", flexDirection: "row" }}
          >
            <Text
              style={[
                { fontSize: 18, textTransform: "capitalize" },
                themeStyles.title,
              ]}
            >
              {json_session.user.first_name}{" "}
            </Text>
            <Text
              style={[
                { fontSize: 18, textTransform: "capitalize" },
                themeStyles.title,
              ]}
            >
              {json_session.user.last_name}
            </Text>
          </View>

          <Text style={[styles.title, themeStyles.title]}>
            @{json_session.user.username.toUpperCase()}
          </Text>
        </View>

        <ChangeProfileImage username={json_session.user.username} />
      </View>

      <View
        style={{
          width: "100%",
          borderRadius: 10,
          paddingVertical: 20,
          paddingHorizontal: 20,
          backgroundColor: currentTheme.blockBackground,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            color: currentTheme.system,
            fontSize: 17,
            fontWeight: "500",
            padding: 5,
          }}
        >
          Color theme
        </Text>

        <ThemeShow />

        <ThemeChoice backgroundColor={currentTheme.blockBackground} />
        <View
          style={{
            marginVertical: 10,
            height: 0.8,
            width: "100%",
            backgroundColor: currentTheme.infoText,
          }}
        />
        <TouchableWithoutFeedback onPress={addedToggleTheme}>
          <View style={{ backgroundColor: currentTheme.blockBackground }}>
            {theme === "light" ? (
              <View style={styles.row}>
                <Animated.View style={animatedStyle}>
                  <FontAwesome
                    name="moon-o"
                    size={23}
                    color={currentTheme.system}
                  />
                </Animated.View>
                <Text style={[styles.text, { color: currentTheme.system }]}>
                  Switch to Night Mode
                </Text>
              </View>
            ) : (
              <View style={styles.row}>
                <Animated.View style={animatedStyle}>
                  <FontAwesome
                    name="sun-o"
                    size={23}
                    color={currentTheme.system}
                  />
                </Animated.View>
                <Text style={[styles.text, { color: currentTheme.system }]}>
                  Switch to Day Mode
                </Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View
        style={{
          width: "100%",
          borderRadius: 10,
          paddingVertical: 20,
          paddingHorizontal: 20,
          backgroundColor: currentTheme.blockBackground,
          marginTop: 10,
        }}
      >
        <ChangeProfileInfo />
      </View>
      <TouchableWithoutFeedback onPress={signOut}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backgroundColor: currentTheme.error,
            paddingVertical: 5,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              color: currentTheme.errorText,
              fontSize: 15,
              fontWeight: "700",
            }}
          >
            Sign Out
          </Text>
          <FontAwesome
            name="sign-out"
            size={23}
            color={currentTheme.errorText}
          />
        </View>
      </TouchableWithoutFeedback>

      {/* <EditScreenInfo path="app/(auth)/modal.tsx" /> */}

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: "center",
    minHeight: "100%",
    overflow: "scroll",
  },
  title: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "transparent",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
  },
});
