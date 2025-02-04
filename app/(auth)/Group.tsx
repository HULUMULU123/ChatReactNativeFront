import useGlobal from "@/constants/global";
import { useTheme } from "@/context/ThemeProvider";
import { colorPalettes, themes } from "@/context/themes";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

const users = [
  { label: "Андрей", value: "1" },
  { label: "Ольга", value: "2" },
  { label: "Иван", value: "3" },
  { label: "Мария", value: "4" },
];

export default function Group() {
  const allChats = useGlobal((state) => state.allChats);
  const createGroup = useGlobal((state) => state.createGroup);
  const [searchText, setSearchText] = useState("");
  const [groupName, setGroupName] = useState("");
  const [data, setData] = useState([]);
  const [members, setMembers] = useState([]);
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  const currentColors = colorPalettes[colorPalette];
  console.log(allChats.data);
  let transformChatData;
  const handleCreate = (groupName, members) => {
    const sortedMembers = data
      .filter((item) => members.includes(item.value))
      .map((item) => item.label);
    console.log(sortedMembers);
    console.log(groupName, sortedMembers);
    createGroup(groupName, sortedMembers);
    router.replace("/two");
  };
  useEffect(() => {
    setData([]);
    allChats?.data.map((chat, index) => {
      const label = chat.chat_name;
      const value = index;
      const newItem = {
        label,
        value,
      };
      setData((prev) => [...prev, newItem]);
    });
  }, []);
  return (
    <View style={{ backgroundColor: currentTheme.background }}>
      <View
        style={{
          backgroundColor: currentTheme.blockBackground,
          paddingHorizontal: 20,
          paddingVertical: 40,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", padding: 10 }}>
          New Group
        </Text>
        <TextInput
          style={{
            borderBottomWidth: 1,
            margin: 10,
            padding: 5,
            fontSize: 16,
            borderBottomColor: currentTheme.brand,
          }}
          placeholder="Group name"
          value={groupName}
          onChangeText={(text) => setGroupName(text)}
        />
        <MultiSelect
          style={[
            styles.dropdown,
            { margin: 10, borderColor: currentTheme.brand },
          ]}
          сontainerStyle={styles.dropdownContainer} // Контейнер выпадающего списка
          selectedStyle={[
            styles.selectedItem,
            { backgroundColor: currentTheme.brand },
          ]} // Стили для выбранных элементов
          selectedTextStyle={{ color: "#fff" }}
          itemTextStyle={styles.itemText} // Текст элементов списка
          data={data}
          labelField="label"
          valueField="value"
          placeholder="Выберите участников"
          value={members}
          onChange={(selectedItems) => setMembers(selectedItems)} // Просто сохраняем массив
          search
          searchPlaceholder="Поиск чатов..."
          searchText={searchText}
          onSearchChange={setSearchText}
          searchQuery={searchText}
        />
        <TouchableOpacity
          onPress={() => handleCreate(groupName, members)}
          style={{ marginLeft: "auto", marginTop: 10 }}
        >
          <View
            style={{
              padding: 10,
              backgroundColor: currentTheme.brand,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>Create</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  dropdown: {
    // Цвет границы
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dropdownContainer: {
    backgroundColor: "#fff", // Фон выпадающего списка
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Тень для Android
  },
  selectedItem: {
    // Цвет фона выбранных элементов
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    color: "#fff",
  },
  itemText: {
    fontSize: 16,
    color: "#333", // Цвет текста
  },
});
