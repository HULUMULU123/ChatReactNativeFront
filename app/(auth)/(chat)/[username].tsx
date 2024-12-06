import {
  Button,
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSession } from "@/app/ctx";
import useGlobal from "@/constants/global";
import { useEffect, useRef, useState } from "react";
import Search from "@/components/main/Search";
import UserList from "@/components/userSearch/UserList";
import { useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import ModalAddFiles from "@/components/chat/ModalAddFiles";

// const messages = [
//   {
//     id: "1",
//     username: "test1",
//     message:
//       "Hello, my name is test! I would like to present you my new project!",
//   },
//   {
//     id: "2",
//     username: "stas",
//     message:
//       "Hello, my name is test! I would like to present you my new project!",
//   },
//   {
//     id: "3",
//     username: "stas",
//     message:
//       "Hello, my name is test! I would like to present you my new project!",
//   },
//   {
//     id: "4",
//     username: "test1",
//     message:
//       "Hello, my name is test! I would like to present you my new project!",
//   },
//   {
//     id: "5",
//     username: "test1",
//     message:
//       "Hello, my name is test! I would like to present you my new project!",
//   },
//   {
//     id: "6",
//     username: "stas",
//     message:
//       "Hello, my name is test! I would like to present you my new project!",
//   },
//   {
//     id: "7",
//     username: "stas",
//     message:
//       "Hello, my name is test! I would like to present you my new project!",
//   },
//   {
//     id: "8",
//     username: "test1",
//     message:
//       "Hello, my name is test! I would like to present you my new project!",
//   },
// ];

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function ModalScreen() {
  const [message, setMessage] = useState("");

  const chat = useGlobal((state) => state.chat);
  const isLoading = useGlobal((state) => state.isLoadingChat);

  const getAllChats = useGlobal((state) => state.getAllChats);

  const [messages, setMessages] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);

  // console.log(chat.data, "chatik");
  const { signOut, session } = useSession();
  const scrollViewRef = useRef();
  const json_session = JSON.parse(session || "");
  // const isLoading = useGlobal((state) => state.isLoaiding);
  const { username } = useLocalSearchParams();
  const sendMessageG = useGlobal((state) => state.sendMessage);

  const commingMessage = useGlobal((state) => state.message);
  console.log(attachedFiles, "attachedFiles");
  const renderMSG = ({ item }) => {
    const username =
      item.username === json_session.user.username ? "ME" : item.username;
    const styleing = username === "ME" ? styles.myMSG : styles.friendMSG;
    const styledText =
      username === "ME" ? styles.msgTextMe : styles.msgTextFriend;
    return (
      <View style={styleing}>
        <Text style={styledText}>{item.message}</Text>
      </View>
    );
  };
  useEffect(() => {
    console.log(isLoading);
    if (!isLoading) {
      setMessages(chat?.data);
    }
  }, [chat]);

  useEffect(() => {
    if (commingMessage) {
      console.log("paral", commingMessage);
      const newMessage = {
        id: Math.random(),
        content: commingMessage?.msg,
        username: username,
      };
      // messages.push(newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      console.log("newMSG", newMessage);
    }
  }, [commingMessage]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
    console.log(messages);
  }, [messages]);
  const sendMessage = () => {
    console.log(message);
    sendMessageG(message, json_session.user.username, username);
    const newMessage = {
      id: Math.random(),
      content: message,
      username: json_session.user.username,
    };
    setMessage("");
    // messages.push(newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    getAllChats();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <ScrollView ref={scrollViewRef} style={{ width: "100%" }}>
            {messages.map((item) =>
              item.username === json_session.user.username ? (
                <View key={item.id} style={styles.myMSG}>
                  <Text style={styles.msgTextMe}>{item.content}</Text>
                </View>
              ) : (
                <View key={item.id} style={styles.friendMSG}>
                  <Text style={styles.msgTextFriend}>{item.content}</Text>
                </View>
              )
            )}
          </ScrollView>
        )}
        <View style={styles.inputContiner}>
          <ModalAddFiles setAttachedFiles={setAttachedFiles} />
          <TextInput
            style={styles.textInput}
            multiline
            scrollEnabled
            placeholder="Message"
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <TouchableWithoutFeedback onPress={() => sendMessage()}>
            <FontAwesome name="send" size={25} color="#000" />
          </TouchableWithoutFeedback>
        </View>
      </View>
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

  inputContiner: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 50,
    marginTop: "auto",
    overflow: "hidden",
    justifyContent: "center",
  },

  textInput: {
    width: "80%",
    paddingHorizontal: 10,
    minHeight: 40,
    maxHeight: 150, // Limit height to show scrollbar on overflow

    fontSize: 15,

    overflow: "hidden", // Ensures text does not overflow the TextInput area
    textAlignVertical: "center", // Align text to the top for multiline input
  },

  friendMSG: {
    width: "40%",

    backgroundColor: "#e1e0e6",
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    marginLeft: 5,
    marginVertical: 5,
    padding: 10,
  },
  myMSG: {
    width: "40%",
    marginLeft: "auto",
    backgroundColor: "#1987f7",
    fontSize: 15,
    borderRadius: 20,
    borderBottomRightRadius: 0,
    marginRight: 5,
    marginVertical: 5,
    padding: 10,
  },
  msgAuthorFriend: {
    fontSize: 20,
    textTransform: "uppercase",
  },
  msgAuthorMe: {},
  msgTextMe: {
    color: "#fff",
    fontSize: 16,
  },
  msgTextFriend: {
    fontSize: 16,
  },
});
