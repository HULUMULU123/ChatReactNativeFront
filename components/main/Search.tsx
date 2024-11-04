import useGlobal from "@/constants/global";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

export default function Search() {
  const [search, setSearch] = useState("");
  const [color, setColor] = useState("#dbdbdb");

  const searchList = useGlobal((state) => state.searchList);
  const searchUsers = useGlobal((state) => state.searchUsers);

  useEffect(() => {
    searchUsers(search);
  }, [search]);
  const onSearch = (text: string) => {
    setSearch(text);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <TextInput
        value={search}
        onChangeText={(text) => onSearch(text)}
        placeholder="Search"
        style={{
          borderRadius: 10,
          backgroundColor: color,
          width: "80%",
          paddingHorizontal: 10,
          paddingVertical: 4,
          fontSize: 15,
        }}
      />
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    borderRadius: 10,

    width: "80%",
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 15,
  },
});
