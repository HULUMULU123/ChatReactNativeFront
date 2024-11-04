import { StatusBar } from "expo-status-bar";
import { Button, Image, Platform, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSession } from "../ctx";

export default function ModalScreen() {
  const { signOut, session } = useSession();

  const json_session = JSON.parse(session || "");
  // const image_path = json_session.user.thumbnail
  //   ? json_session.user.thumbnail
  //   : "@/assets/images/icon.png";
  // console.log(image_path);
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/avatar.png")}
        style={{ width: 180, height: 180, borderRadius: 90 }}
      />
      <Text style={styles.title}>
        @{json_session.user.username.toUpperCase()}
      </Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Button
        title="Sign Out"
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      />
      {/* <EditScreenInfo path="app/(auth)/modal.tsx" /> */}

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
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
    marginTop: 4,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
