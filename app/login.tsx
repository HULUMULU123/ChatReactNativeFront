import { Button, StyleSheet, TextInput } from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "./ctx";
import { router } from "expo-router";
import { useState } from "react";
import api from "@/api/api";

function checkForAuth(session: string | undefined | null) {
  const auth = JSON.parse(session || '{"auth": false, "user": null}').auth;
  auth ? router.replace("/") : console.log("session error");
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, session } = useSession();
  const handleLogin = async () => {
    if (username && password) {
      try {
        const res = await api({
          method: "POST",
          url: "http://10.0.2.2:8000/api/signin/",
          data: {
            username: username,
            password: password,
          },
        });

        console.log(res.data);

        // Assuming `signIn` is a function that updates your session
        await signIn(res.data); // Ensure this function handles the session correctly

        // Only navigate after sign-in is successful
        router.replace("/");
      } catch (error) {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome to Lifechat! This is Login page!{" "}
      </Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <TextInput
        placeholder="Username(not required)"
        style={styles.input}
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        placeholder="Password(not required)"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="You can register here" onPress={handleRegistration} />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center",
  },

  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    margin: 10,
    borderRadius: 4,
  },
});
