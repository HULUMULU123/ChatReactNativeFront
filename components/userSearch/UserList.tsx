import { useSession } from "@/app/ctx";
import useGlobal from "@/constants/global";
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
        <View style={styles.userItem}>
          <Image
            source={require("@/assets/images/avatar.png")}
            style={{ width: 50, height: 50, borderRadius: 90 }}
          />
          <Text style={[styles.userText, isLastItem && styles.lastItem]}>
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
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    width: "80%",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
});
