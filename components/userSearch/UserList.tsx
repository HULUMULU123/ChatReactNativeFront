import { useSession } from "@/app/ctx";
import useGlobal from "@/constants/global";
import { useTheme } from "@/context/ThemeProvider";
import { colorPalettes, themes } from "@/context/themes";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Users {
  users: User[];
}

interface User {
  username: string;
  status: string;
}

export default function UserList({ users }: { users: Users }) {
  const router = useRouter();
  const { signOut, session } = useSession();
  const json_session = JSON.parse(session || "");
  const user1 = json_session.user.username;
  const getChat = useGlobal((state) => state.getChat);
  const { theme, colorPalette, toggleTheme, changeColorPalette } = useTheme();
  const currentTheme = themes[theme];
  const currentColors = colorPalettes[colorPalette];
  console.log(users, "users");
  function handleChat(user1: string, user2: string) {
    getChat(user1, user2);
  }

  const renderItem = ({ item, index }) => {
    const isLastItem = index === users.length - 1; // Проверяем, последний ли это элемент
    console.log(isLastItem, users.length);
    return (
      <TouchableOpacity
        onPress={() => {
          router.navigate(`(chat)/${item.username}`);
          handleChat(user1, item.username);
        }}
      >
        <View
          style={[
            styles.userItem,
            {
              backgroundColor: currentTheme.blockBackground,
              borderRadius: 10,
              marginBottom: 3,
              padding: 5,
            },
          ]}
        >
          <Image
            source={{
              uri: `http://10.0.2.2:8000${item.thumbnail}`,
            }}
            style={{ width: 50, height: 50, borderRadius: 90 }}
          />
          <Text
            style={[
              styles.userText,
              isLastItem && styles.lastItem,
              { color: currentTheme.text },
            ]}
          >
            {item.username}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.username}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  userItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  userText: {
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 20,
    width: "80%",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
});
