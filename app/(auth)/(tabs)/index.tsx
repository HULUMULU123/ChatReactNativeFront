import { Button, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSession } from "../../ctx";
import useGlobal from "@/constants/global";
import { useEffect } from "react";
import Search from "@/components/main/Search";

export default function TabOneScreen() {
  const { signOut, session } = useSession();

  const json_session = JSON.parse(session || "");

  const socketConnect = useGlobal((state) => state.socketConnect);
  const socketClose = useGlobal((state) => state.socketClose);
  useEffect(() => {
    socketConnect(json_session.tokens);
    return () => {
      socketClose();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Chats</Text>
      <Search />
      <Text>Welcome, {json_session.user.username.toUpperCase()}</Text>
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
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
