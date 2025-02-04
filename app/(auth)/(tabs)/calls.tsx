import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import CallScreen from "@/components/calls/CallScreen";
import CallScreenDemo from "@/components/calls/CallScreenDemo";

export default function TabCallsScreen() {
  return (
    <View style={styles.container}>
      <CallScreenDemo />
      {/* <CallScreen roomName={"rfef499f30"} /> */}
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
