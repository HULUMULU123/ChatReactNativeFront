import {
  Button,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSession } from "../../ctx";
import useGlobal from "@/constants/global";
import { useEffect } from "react";
import Search from "@/components/main/Search";
import UserList from "@/components/userSearch/UserList";
import { Link } from "expo-router";

export default function TabOneScreen() {
  const { signOut, session } = useSession();

  const json_session = JSON.parse(session || "");

  const socketConnect = useGlobal((state) => state.socketConnect);
  const socketClose = useGlobal((state) => state.socketClose);

  const searchList = useGlobal((state) => state.searchList);

  const isLoading = useGlobal((state) => state.isLoaiding);
  console.log("fdsf", searchList, "srsdcs");
  useEffect(() => {
    socketConnect(json_session.tokens);
    return () => {
      socketClose();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Button
          title="Sign Out"
          onPress={() => {
            // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
            signOut();
          }}
        />
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
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
