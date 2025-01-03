import { Button, StyleSheet, TextInput } from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "./ctx";
import { router } from "expo-router";
import api from "@/api/api";
import { useState } from "react";
// import forge from "node-forge";
// import NodeRSA from "node-rsa";
export default function Login() {
  const { signIn } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    // const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 }); // 2048-битный RSA
    // const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey); // Публичный ключ в формате PEM
    // const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey); // Приватный ключ в формате PEM
    // const key = new NodeRSA({ b: 2048 });
    // const publicKey = key.exportKey("public");
    // const privateKey = key.exportKey("private");
    console.log(password, username);
    api({
      method: "POST",
      url: "http://10.0.2.2:8000/api/signup/",
      data: {
        username,
        password,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome to Lifechat! Here you can register on our chat!{" "}
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

      <Button title="Register" onPress={handleLogin} />
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
