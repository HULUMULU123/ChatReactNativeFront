import useGlobal from "@/constants/global";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function Search() {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const searchUsers = useGlobal((state) => state.searchUsers);

  useEffect(() => {
    searchUsers(search);
  }, [search]);
  const onSearch = (text: string) => {
    setSearch(text);
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss}>
      <View style={styles.inputContainer}>
        <TextInput
          value={search}
          onChangeText={(text) => onSearch(text)}
          placeholder="Search"
          style={[
            styles.input, // Base style
            isFocused ? styles.focusedInput : {}, // Conditional focused style
            search ? styles.typingInput : {}, // Conditional typing style
          ]}
          onFocus={() => {
            console.log("focus");
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch("")}>
            <FontAwesome
              name="times-circle"
              size={25}
              color="#e9e9e9"
              style={styles.icon}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",

    borderRadius: 10,
    paddingHorizontal: 10,
    width: "100%",
  },
  icon: {
    position: "absolute",
    right: 5,
    top: "-34%",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",

    borderRadius: 10,
    backgroundColor: "#efefef",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 15,
  },
  focusedInput: {
    borderColor: "#bababa", // Change color on focus
    backgroundColor: "#d8d8d8",
  },
  typingInput: {
    borderColor: "#a4a2a2", // Change color when typing
    backgroundColor: "#bababa",
  },
});
