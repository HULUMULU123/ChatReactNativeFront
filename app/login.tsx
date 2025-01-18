import {
  Button,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "./ctx";
import { router } from "expo-router";
import { useState } from "react";

import { gzip, ungzip } from "pako";
import api from "@/api/api";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeProvider";
import { themes } from "@/context/themes";

function checkForAuth(session: string | undefined | null) {
  const auth = JSON.parse(session || '{"auth": false, "user": null}').auth;
  auth ? router.replace("/") : console.log("session error");
}

const { width } = Dimensions.get("window");

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  const { signIn, session } = useSession();

  const handleLogin = async () => {
    if (username && password) {
      try {
        console.log(username, password);
        const res = await api({
          method: "POST",
          url: "http://10.0.2.2:8000/api/signin/",
          data: {
            username: username,
            password: password,
          },
        });
        console.log(res.data.user.public_key);

        const private_key = res.data.user.private_key || "";
        delete res.data.user.private_key;
        // Assuming `signIn` is a function that updates your session
        await signIn(res.data, private_key); // Ensure this function handles the session correctly

        // Only navigate after sign-in is successful
        console.log(username, password);
        router.replace("/");
      } catch (error) {
        goToNextStep();
        console.error("Error during sign in:", error);
        console.log(error);
        alert(
          "Failed to sign in. Please check your credentials and try again."
        );
      }
    } else {
      console.log("Please enter both username and password");
    }

    // signIn({ username: "stas" });
    // console.log("pressed");
    // router.push("/");
    // signIn();
  };

  const handleRegistration = () => {
    router.replace("/register");
  };

  const [step, setStep] = useState(-1); // Текущий шаг: 0 = ник, 1 = пароль

  const translateX = useSharedValue(width);

  const togglePosition = useSharedValue(0); // Позиция иконки

  const addedToggleTheme = () => {
    // Переключение темы
    toggleTheme();
    togglePosition.value = withTiming(theme == "light" ? 30 : 0, {
      duration: 300,
    });
  };

  const animatedStyleTheme = useAnimatedStyle(() => ({
    transform: [{ translateX: togglePosition.value }],
  }));
  // Переход к следующему шагу
  const goToNextStep = () => {
    if (step < 2) {
      translateX.value = withTiming(-(step + 1) * width, { duration: 500 });
      setStep(step + 1);
    }
  };

  // Переход к предыдущему шагу
  const goToPreviousStep = () => {
    if (step > -1) {
      translateX.value = withTiming(-(step - 1) * width, { duration: 500 });
      setStep(step - 1);
    }
  };
  const goToFirstStep = () => {
    translateX.value = withTiming(1 * width, { duration: 500 });
    setStep(-1);
  };

  // Анимация сдвига шагов
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const isLightTheme = theme === "light";

  return (
    // <View style={styles.container}>
    //   <Text style={styles.title}>
    //     Welcome to Lifechat! This is Login page!{" "}
    //   </Text>
    //   <View
    //     style={styles.separator}
    //     lightColor="#eee"
    //     darkColor="rgba(255,255,255,0.1)"
    //   />
    //   <TextInput
    //     placeholder="Username(not required)"
    //     style={styles.input}
    //     value={username}
    //     onChangeText={(text) => setUsername(text)}
    //   />
    //   <TextInput
    //     placeholder="Password(not required)"
    //     secureTextEntry
    //     style={styles.input}
    //     value={password}
    //     onChangeText={(text) => setPassword(text)}
    //   />
    //   <Button title="You can register here" onPress={handleRegistration} />

    //   <Button title="Login" onPress={handleLogin} />
    // </View>
    <View
      style={[
        styles.container,
        {
          backgroundColor: currentTheme.background,
          position: "relative",
        },
      ]}
    >
      {/* Переключатель темы */}
      <View
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          backgroundColor: "transparent",
        }}
      >
        <TouchableWithoutFeedback onPress={addedToggleTheme}>
          <View
            style={[
              styles.toggleContainer,
              theme === "light" ? styles.lightMode : styles.darkMode,
            ]}
          >
            <Animated.View style={[animatedStyleTheme]}>
              {theme === "light" ? (
                <FontAwesome name="sun-o" size={20} color="#fff" />
              ) : (
                <FontAwesome name="moon-o" size={20} color="#fff" />
              )}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <Animated.View style={[styles.slider, animatedStyle]}>
        {/* Шаг 1: Ввод ника */}
        <View
          style={[
            styles.step,
            { backgroundColor: currentTheme.blockBackground },
          ]}
        >
          <Text
            style={[styles.title, { color: isLightTheme ? "#000" : "#fff" }]}
          >
            Enter your nickname
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isLightTheme ? "#fff" : "#333",
                color: isLightTheme ? "#000" : "#fff",
              },
            ]}
            placeholder="Nickname"
            value={username}
            onChangeText={(text) => setUsername(text)}
            placeholderTextColor={isLightTheme ? "#aaa" : "#666"}
          />
          <View
            style={{ flexDirection: "row", backgroundColor: "transparent" }}
          >
            <Text>Don't have an account? You can sign up </Text>
            <TouchableWithoutFeedback onPress={handleRegistration}>
              <Text
                style={{
                  color: currentTheme.brand,
                  textDecorationLine: "underline",
                }}
              >
                here
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <TouchableWithoutFeedback onPress={goToNextStep}>
            <View
              style={{
                backgroundColor: currentTheme.brand,
                padding: 10,
                borderRadius: 7,
                marginTop: 10,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "500", fontSize: 15 }}>
                Next
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* Шаг 2: Ввод пароля */}
        <View
          style={[
            styles.step,
            { backgroundColor: currentTheme.blockBackground },
          ]}
        >
          <Text
            style={[styles.title, { color: isLightTheme ? "#000" : "#fff" }]}
          >
            Enter your password
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isLightTheme ? "#fff" : "#333",
                color: currentTheme.text,
              },
            ]}
            placeholder="Password"
            placeholderTextColor={isLightTheme ? "#aaa" : "#666"}
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <View style={styles.buttonRow}>
            <TouchableWithoutFeedback onPress={goToPreviousStep}>
              <View
                style={{
                  backgroundColor: currentTheme.brand,
                  padding: 10,
                  borderRadius: 7,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "500", fontSize: 15 }}
                >
                  Back
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={handleLogin}>
              <View
                style={{
                  backgroundColor: currentTheme.brand,
                  padding: 10,
                  borderRadius: 7,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "500", fontSize: 15 }}
                >
                  Login
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {/* Шаг 3: Успешный вход */}
        <View
          style={[
            styles.step,
            { backgroundColor: currentTheme.blockBackground },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: isLightTheme ? "#000" : "#fff", textAlign: "center" },
            ]}
          >
            Ooops! Something went wrong! Please try again!
          </Text>
          <TouchableWithoutFeedback onPress={goToFirstStep}>
            <View
              style={{
                backgroundColor: currentTheme.brand,
                padding: 10,
                borderRadius: 7,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "500", fontSize: 15 }}>
                Try Again
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Animated.View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   paragraph: {
//     margin: 24,
//     fontSize: 18,
//     textAlign: "center",
//   },

//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: "80%",
//   },
//   input: {
//     width: "80%",
//     borderWidth: 1,
//     borderColor: "#000",
//     padding: 10,
//     margin: 10,
//     borderRadius: 4,
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slider: {
    flexDirection: "row",
    width: width * 3, // Ширина для 3 шагов
  },
  step: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingVertical: 40,
    borderRadius: 10,
  },
  lightStep: {
    backgroundColor: "#e3f2fd",
  },
  darkStep: {
    backgroundColor: "#37474f",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonRow: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  themeSwitcher: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  toggleContainer: {
    width: 60, // Ширина переключателя
    height: 30, // Высота переключателя
    borderRadius: 15, // Закругление краев
    justifyContent: "center", // Выравнивание по вертикали
    padding: 4, // Внутренний отступ
  },
  lightMode: {
    backgroundColor: "#FFA500", // Цвет фона для светлой темы
  },
  darkMode: {
    backgroundColor: "#4d4b4b", // Цвет фона для темной темы
  },
  circle: {
    width: 22, // Размер круга
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFF", // Белый цвет круга
    justifyContent: "center", // Выравнивание содержимого по центру
    alignItems: "center",
  },
});
