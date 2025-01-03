import {
  Button,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSession } from "../../ctx";
import useGlobal from "@/constants/global";
import { useEffect, useState } from "react";
import Search from "@/components/main/Search";
import UserList from "@/components/userSearch/UserList";
import { Link, useRouter } from "expo-router";
import TimeAgo from "@/components/chat/TimeAgo";

const months = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export default function TabOneScreen() {
  const { signOut, session } = useSession();
  const router = useRouter();

  const json_session = JSON.parse(session || "");

  const user1 = json_session.user.username;

  const socketConnect = useGlobal((state) => state.socketConnect);
  const socketClose = useGlobal((state) => state.socketClose);
  const socket = useGlobal((state) => state.socket);

  const getAllChats = useGlobal((state) => state.getAllChats);
  const allChats = useGlobal((state) => state.allChats);
  const [recreatedChats, setRecreatedChats] = useState([]);
  const searchList = useGlobal((state) => state.searchList);

  const isLoading = useGlobal((state) => state.isLoaiding);

  const getChat = useGlobal((state) => state.getChat);
  const commingMessage = useGlobal((state) => state.message);

  console.log("fdsf", searchList, "srsdcs");
  useEffect(() => {
    socketConnect(json_session.tokens);

    return () => {
      socketClose();
    };
  }, []);
  // if (socket != null) {
  //   console.log(socket, "socket");
  //   // getAllChats();
  // }
  useEffect(() => {
    setRecreatedChats([]);
    console.log(commingMessage, "comhere");
    let today = new Date();
    let todayDay = today.getDate();
    let todayYear = today.getFullYear();
    let todayHour = today.getHours();
    let todayMinutes = today.getMinutes();
    allChats?.data.map((chat) => {
      let created_at_date = new Date(chat.last_message.created_at);
      let created_day = created_at_date.getDate();
      let created_month = created_at_date.getMonth();
      let created_year = created_at_date.getFullYear();
      let created_hour = created_at_date.getHours();
      let created_minutes = created_at_date.getMinutes();
      let created_at;
      if (todayDay === created_day && todayYear === created_year) {
        if (todayHour - created_hour >= 1) {
          created_at = `${todayHour - created_hour} hours ago`;
        } else if (todayMinutes == created_minutes) {
          created_at = "Moment ago";
        } else {
          created_at = `${todayMinutes - created_minutes} minutes ago`;
        }
      } else if (todayYear === created_year) {
        created_at = `${created_day} ${months[created_month + 1]}`;
      } else {
        created_at = `${created_day} ${
          months[created_month + 1]
        } ${created_year}`;
      }
      let newChat = {
        chat_name: chat.chat_name,
        content: chat?.last_message.content
          ? chat?.last_message?.content.length < 10
            ? chat.last_message.content
            : `${chat.last_message.content.slice(0, 10)}...`
          : "",
        created_at: chat.last_message.created_at,
        from: chat.last_message.from === user1 ? "Me" : chat.last_message.from,
      };
      console.log(chat.chat_name, recreatedChats, newChat, "testingChats");
      setRecreatedChats((prevChats) => [...prevChats, newChat]);
    });
    console.log(allChats, "allChats123");
    console.log(recreatedChats);
  }, [allChats, commingMessage]);

  function handleChat(user1: string, user2: string) {
    getChat(user1, user2);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollChats}>
          {allChats?.data && allChats?.data?.length > 0 ? (
            recreatedChats.map((chat) => (
              <TouchableOpacity
                onPress={() => {
                  router.navigate(`(chat)/${chat.chat_name}`);
                  handleChat(user1, chat.chat_name);
                }}
                key={chat.chat_name}
              >
                <View key={chat.chat_name} style={styles.chatItem}>
                  <Image
                    source={require("@/assets/images/avatar.png")}
                    style={{ width: 50, height: 50, borderRadius: 90 }}
                  />
                  <View style={styles.msgInformation}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                    >
                      {chat.chat_name}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text>{chat.from}: </Text>
                      <Text>{chat.content}</Text>
                    </View>
                  </View>
                  <TimeAgo timestamp={chat?.created_at} />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text>Loading...</Text>
          )}
        </ScrollView>
      </View>
      {/* <View style={styles.container}>
        <Button
          title="Sign Out"
          onPress={() => {
            // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
            signOut();
          }}
        />
      </View> */}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
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
  scrollChats: {
    flex: 1,
    width: "100%",
  },
  chatItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",

    marginVertical: 15,
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  msgInformation: {
    flexDirection: "column",
    width: 100,
    marginLeft: 20,
  },
});
